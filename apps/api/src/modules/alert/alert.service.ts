import {
    BadRequestException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
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
            continueTokenId: a.continueTokenId,
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
        continueTokenId: string,
        { message, sender }: SendAlertDtoOutput,
    ): Promise<AlertDto> {
        const ct = await this.prisma.continueToken.findUnique({
            where: { id: continueTokenId },
        });
        if (!ct) throw new NotFoundException();
        // Фича алертов — только для iphone-доступов.
        if (ct.type !== "IPHONE") throw new BadRequestException();

        // Инвариант «один активный»: гасим прежний активный и создаём новый.
        const alert = await this.prisma.$transaction(async (tx) => {
            await tx.alert.updateMany({
                where: { continueTokenId, active: true },
                data: { active: false },
            });
            return tx.alert.create({
                data: { continueTokenId, message, sender, active: true },
                include: { views: true },
            });
        });

        this.bus.emitShow(continueTokenId, {
            id: alert.id,
            message: alert.message,
            sender: alert.sender,
        });
        this.bus.emitAdminChanged(continueTokenId);

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
        this.bus.emitAdminChanged(alert.continueTokenId);

        return this.map(alert);
    }

    async resend(alertId: string): Promise<AlertDto> {
        const existing = await this.prisma.alert.findUnique({
            where: { id: alertId },
        });
        if (!existing) throw new NotFoundException();

        // «Отправить заново» = новая активная запись с теми же данными.
        return this.send(existing.continueTokenId, {
            message: existing.message,
            sender: existing.sender,
        });
    }

    async list(
        continueTokenId: string,
        page: number,
        limit: number,
    ): Promise<AlertHistoryDto> {
        const ct = await this.prisma.continueToken.findUnique({
            where: { id: continueTokenId },
            select: { note: true },
        });
        if (!ct) throw new NotFoundException();

        const where = { continueTokenId };
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
            note: ct.note,
            data: items.map((i) => this.map(i)),
            meta: { page, limit, total, pageCount: Math.ceil(total / limit) },
        };
    }

    // ── Публично: посетитель подтверждает показ ──────────────────────
    // Возвращает token доступа — нужен контроллеру, чтобы поставить cookie
    // `alert_seen_<token>` = alertId (дедуп показа на этом устройстве).
    async registerView(
        alertId: string,
    ): Promise<{ token: string; continueTokenId: string }> {
        const alert = await this.prisma.alert.findUnique({
            where: { id: alertId },
            include: { continueToken: true },
        });
        if (!alert) throw new NotFoundException();

        const ip = this.requestContext.ip ?? "unknown";
        await this.prisma.alertView.create({ data: { alertId, ip } });
        this.bus.emitAdminChanged(alert.continueTokenId);

        return {
            token: alert.continueToken.token,
            continueTokenId: alert.continueTokenId,
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
            from(
                this.prisma.continueToken.findUnique({ where: { token } }),
            ),
        ).pipe(
            switchMap((ct) => {
                if (!ct) return throwError(() => new NotFoundException());
                const id = ct.id;

                const replay$ = defer(() =>
                    from(
                        this.prisma.alert.findFirst({
                            where: { continueTokenId: id, active: true },
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
    streamForAdmin(continueTokenId: string): Observable<MessageEvent> {
        const initial$ = defer(() =>
            of<MessageEvent>({
                data: {
                    type: "presence",
                    online: this.bus.isOnline(continueTokenId),
                    count: this.bus.count(continueTokenId),
                },
            }),
        );

        const live$ = this.bus
            .adminStream(continueTokenId)
            .pipe(map((ev): MessageEvent => ({ data: ev })));

        const heartbeat$ = interval(HEARTBEAT_MS).pipe(
            map((): MessageEvent => ({ type: "ping", data: "" })),
        );

        return merge(concat(initial$, live$), heartbeat$);
    }
}
