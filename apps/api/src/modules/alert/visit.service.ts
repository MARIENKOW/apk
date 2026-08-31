import { Injectable, NotFoundException, OnModuleInit } from "@nestjs/common";
import { PrismaService } from "@/infrastructure/prisma/prisma.service";
import { VisitHistoryDto, VisitViewDto } from "@myorg/shared/dto";
import { AccessVisit } from "@/generated/prisma";
import { deviceFromUa, locationFromIp } from "@/common/device/device-geo";

// Реконнект EventSource (сеть моргнула) в пределах окна склеивается в тот же визит,
// а не плодит новую строку. 10с ловит блипы, но «ушёл и вернулся» — уже новый визит.
const VISIT_COALESCE_MS = 10_000;
// Визит считаем онлайн, пока соединение живо И heartbeat свежий. Больше интервала
// записи lastSeenAt (VISIT_DB_HEARTBEAT_MS = 60с) с запасом — иначе ложный оффлайн.
const ONLINE_STALE_MS = 90_000;

@Injectable()
export class VisitService implements OnModuleInit {
    constructor(private prisma: PrismaService) {}

    // После рестарта api висящие открытыми визиты закрываем по последнему heartbeat —
    // иначе они навсегда останутся «онлайн» (presence в памяти уже сброшен).
    async onModuleInit(): Promise<void> {
        await this.prisma.$executeRaw`
            UPDATE "access_visits"
            SET "disconnectedAt" = "lastSeenAt"
            WHERE "disconnectedAt" IS NULL`;
    }

    // ── Lifecycle (дёргается из SSE-стрима посетителя) ───────────────
    // connect: воскрешаем недавно закрытый визит того же ip+ua (склейка) или новый.
    async open(
        tokenId: string,
        ip: string,
        userAgent: string | null,
    ): Promise<string> {
        const since = new Date(Date.now() - VISIT_COALESCE_MS);
        const recent = await this.prisma.accessVisit.findFirst({
            where: {
                tokenId,
                ip,
                userAgent: userAgent ?? null,
                disconnectedAt: { gte: since },
            },
            orderBy: { disconnectedAt: "desc" },
        });

        if (recent) {
            await this.prisma.accessVisit.update({
                where: { id: recent.id },
                data: { disconnectedAt: null, lastSeenAt: new Date() },
            });
            return recent.id;
        }

        const created = await this.prisma.accessVisit.create({
            data: { tokenId, ip, userAgent },
        });
        return created.id;
    }

    async heartbeat(visitId: string): Promise<void> {
        await this.prisma.accessVisit.updateMany({
            where: { id: visitId },
            data: { lastSeenAt: new Date() },
        });
    }

    async close(visitId: string): Promise<void> {
        await this.prisma.accessVisit.updateMany({
            where: { id: visitId, disconnectedAt: null },
            data: { disconnectedAt: new Date() },
        });
    }

    // ── Админ: лог визитов доступа ───────────────────────────────────
    async list(
        tokenId: string,
        page: number,
        limit: number,
    ): Promise<VisitHistoryDto> {
        const t = await this.prisma.token.findUnique({
            where: { id: tokenId },
            select: { note: true },
        });
        if (!t) throw new NotFoundException();

        const where = { tokenId };
        const [items, total] = await Promise.all([
            this.prisma.accessVisit.findMany({
                where,
                orderBy: { connectedAt: "desc" },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.accessVisit.count({ where }),
        ]);

        return {
            note: t.note,
            data: items.map((v) => this.map(v)),
            meta: { page, limit, total, pageCount: Math.ceil(total / limit) },
        };
    }

    private map(v: AccessVisit): VisitViewDto {
        const online =
            v.disconnectedAt === null &&
            v.lastSeenAt.getTime() >= Date.now() - ONLINE_STALE_MS;

        return {
            id: v.id,
            ip: v.ip.replace(/^::ffff:/, ""),
            device: deviceFromUa(v.userAgent),
            location: locationFromIp(v.ip),
            connectedAt: v.connectedAt.toISOString(),
            disconnectedAt: v.disconnectedAt?.toISOString() ?? null,
            online,
        };
    }
}
