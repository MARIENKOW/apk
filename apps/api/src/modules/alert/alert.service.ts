import { Injectable, NotFoundException } from "@nestjs/common";
import { MessageEvent } from "@nestjs/common";
import {
    EMPTY,
    Observable,
    concat,
    defer,
    from,
    interval,
    map,
    merge,
    mergeMap,
    of,
    switchMap,
    throwError,
} from "rxjs";
import { PrismaService } from "@/infrastructure/prisma/prisma.service";
import { RequestContextService } from "@/common/request-context/request-context.service";
import { AlertBusService } from "@/modules/alert/alert-bus.service";
import { AlertDto, AlertHistoryDto } from "@myorg/shared/dto";
import { SendAlertDtoOutput } from "@myorg/shared/form";
import { Alert, AlertView } from "@/generated/prisma";

// Интервал heartbeat-события SSE — держит соединение живым через прокси/мобильную сеть.
const HEARTBEAT_MS = 25_000;

type AlertWithViews = Alert & { views: AlertView[] };

@Injectable()
export class AlertService {
    constructor(
        private prisma: PrismaService,
        private requestContext: RequestContextService,
        private bus: AlertBusService,
    ) {}

    private map(a: AlertWithViews): AlertDto {
        return {
            id: a.id,
            tokenId: a.tokenId,
            message: a.message,
            sender: a.sender,
            active: a.active,
            createdAt: a.createdAt.toISOString(),
            viewCount: a.views.length,
            views: a.views.map((v) => ({
                id: v.id,
                ip: v.ip,
                shownAt: v.shownAt.toISOString(),
            })),
        };
    }

    // ── Админ: отправить / остановить / переотправить / история ──────
    async send(
        tokenId: string,
        { message, sender }: SendAlertDtoOutput,
    ): Promise<AlertDto> {
        const t = await this.prisma.token.findUnique({ where: { id: tokenId } });
        if (!t) throw new NotFoundException();

        // Инвариант «один активный»: гасим прежний активный и создаём новый.
        const alert = await this.prisma.$transaction(async (tx) => {
            await tx.alert.updateMany({
                where: { tokenId, active: true },
                data: { active: false },
            });
            return tx.alert.create({
                data: { tokenId, message, sender, active: true },
                include: { views: true },
            });
        });

        this.bus.emitShow(tokenId, {
            id: alert.id,
            message: alert.message,
            sender: alert.sender,
        });
        this.bus.emitAdminChanged(tokenId);

        return this.map(alert);
    }

    async stop(alertId: string): Promise<AlertDto> {
        const existing = await this.prisma.alert.findUnique({
            where: { id: alertId },
        });
        if (!existing) throw new NotFoundException();

        // Вариант B: клиенту НЕ шлём событие — кто уже видит, держит до ухода со страницы.
        const alert = await this.prisma.alert.update({
            where: { id: alertId },
            data: { active: false },
            include: { views: true },
        });
        this.bus.emitAdminChanged(alert.tokenId);

        return this.map(alert);
    }

    async resend(alertId: string): Promise<AlertDto> {
        const existing = await this.prisma.alert.findUnique({
            where: { id: alertId },
        });
        if (!existing) throw new NotFoundException();

        // «Отправить заново» = новая активная запись с теми же данными.
        return this.send(existing.tokenId, {
            message: existing.message,
            sender: existing.sender,
        });
    }

    async list(
        tokenId: string,
        page: number,
        limit: number,
    ): Promise<AlertHistoryDto> {
        const t = await this.prisma.token.findUnique({
            where: { id: tokenId },
            select: { note: true },
        });
        if (!t) throw new NotFoundException();

        const where = { tokenId };
        const [items, total] = await Promise.all([
            this.prisma.alert.findMany({
                where,
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * limit,
                take: limit,
                include: { views: { orderBy: { shownAt: "desc" } } },
            }),
            this.prisma.alert.count({ where }),
        ]);

        return {
            note: t.note,
            data: items.map((i) => this.map(i)),
            meta: { page, limit, total, pageCount: Math.ceil(total / limit) },
        };
    }

    // ── Публично: посетитель подтверждает показ ──────────────────────
    // Возвращает token доступа — нужен контроллеру, чтобы поставить cookie
    // `alert_seen_<token>` = alertId (дедуп показа на этом устройстве).
    async registerView(
        alertId: string,
    ): Promise<{ token: string; tokenId: string }> {
        const alert = await this.prisma.alert.findUnique({
            where: { id: alertId },
            include: { token: true },
        });
        if (!alert) throw new NotFoundException();

        const ip = this.requestContext.ip ?? "unknown";
        await this.prisma.alertView.create({ data: { alertId, ip } });
        this.bus.emitAdminChanged(alert.tokenId);

        return {
            token: alert.token.token,
            tokenId: alert.tokenId,
        };
    }

    // ── SSE: стрим посетителя ────────────────────────────────────────
    // replay активного алерта при подключении (если он ещё не показан этому
    // браузеру — сверяем с seenAlertId из cookie), затем живые show-события.
    // presence$ управляет счётчиком «онлайн» на всё время подписки.
    streamForVisitor(
        token: string,
        seenAlertId: string | undefined,
    ): Observable<MessageEvent> {
        return defer(() =>
            from(this.prisma.token.findUnique({ where: { token } })),
        ).pipe(
            switchMap((t) => {
                if (!t) return throwError(() => new NotFoundException());
                const id = t.id;

                const replay$ = defer(() =>
                    from(
                        this.prisma.alert.findFirst({
                            where: { tokenId: id, active: true },
                            orderBy: { createdAt: "desc" },
                        }),
                    ),
                ).pipe(
                    mergeMap((active) =>
                        active && active.id !== seenAlertId
                            ? of<MessageEvent>({
                                  data: {
                                      type: "show",
                                      alert: {
                                          id: active.id,
                                          message: active.message,
                                          sender: active.sender,
                                      },
                                  },
                              })
                            : EMPTY,
                    ),
                );

                const live$ = this.bus
                    .clientStream(id)
                    .pipe(map((ev): MessageEvent => ({ data: ev })));

                const heartbeat$ = interval(HEARTBEAT_MS).pipe(
                    map((): MessageEvent => ({ type: "ping", data: "" })),
                );

                // Никогда не эмитит — только держит presence на время подписки.
                const presence$ = new Observable<MessageEvent>(() => {
                    this.bus.addClient(id);
                    return () => this.bus.removeClient(id);
                });

                return merge(concat(replay$, live$), heartbeat$, presence$);
            }),
        );
    }

    // ── SSE: админский стрим доступа ─────────────────────────────────
    // Сразу отдаёт текущее присутствие, затем presence/changed-события.
    streamForAdmin(tokenId: string): Observable<MessageEvent> {
        const initial$ = defer(() =>
            of<MessageEvent>({
                data: {
                    type: "presence",
                    online: this.bus.isOnline(tokenId),
                    count: this.bus.count(tokenId),
                },
            }),
        );

        const live$ = this.bus
            .adminStream(tokenId)
            .pipe(map((ev): MessageEvent => ({ data: ev })));

        const heartbeat$ = interval(HEARTBEAT_MS).pipe(
            map((): MessageEvent => ({ type: "ping", data: "" })),
        );

        return merge(concat(initial$, live$), heartbeat$);
    }
}
