import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/infrastructure/prisma/prisma.service";
import { RequestContextService } from "@/common/request-context/request-context.service";
import { AlertBusService } from "@/modules/alert/alert-bus.service";
import { TokenContextDto, TokenDto, PagedResult } from "@myorg/shared/dto";
import { ContinueTokenType } from "@myorg/shared/dto";
import {
    CreateTokenDtoOutput,
    UpdateNoteTokenDtoOutput,
    UpdateTypeTokenDtoOutput,
} from "@myorg/shared/form";
import { FULL_PATH_ROUTE } from "@myorg/shared/route";
import {
    Token,
    ContinueTokenType as PrismaContinueTokenType,
} from "@/generated/prisma";
import { randomUUID } from "crypto";
import { env } from "@/config";

@Injectable()
export class TokenService {
    constructor(
        private prisma: PrismaService,
        private requestContext: RequestContextService,
        private bus: AlertBusService,
    ) {}

    // Enum БД (ANDROID/IPHONE) ⇄ значение DTO (android/iphone).
    private toPrismaType(type: ContinueTokenType): PrismaContinueTokenType {
        return type === "iphone" ? "IPHONE" : "ANDROID";
    }

    private toDtoType(type: PrismaContinueTokenType): ContinueTokenType {
        return type === "IPHONE" ? "iphone" : "android";
    }

    // Ссылка зависит от панели: 2-я часть — особый домен (APP_ORIGIN) + путь /continue;
    // 1-я — обычный origin запроса и корень токена.
    private buildUrl(token: string, isSecondPart: boolean): string {
        if (isSecondPart) {
            const origin = (
                env.APP_ORIGIN ||
                this.requestContext.origin ||
                ""
            ).replace(/\/$/, "");
            return `${origin}/${token}${FULL_PATH_ROUTE.continue.path}`;
        }
        return `${this.requestContext.origin}/${token}`;
    }

    private map(t: Token): TokenDto {
        return {
            id: t.id,
            token: t.token,
            note: t.note,
            type: this.toDtoType(t.type),
            isSecondPart: t.isSecondPart,
            online: this.bus.isOnline(t.id),
            url: this.buildUrl(t.token, t.isSecondPart),
            createdAt: t.createdAt.toISOString(),
        };
    }

    async getAll(
        page: number,
        limit: number,
        order: string = "desc",
        query: string = "",
        isSecondPart: boolean = false,
    ): Promise<PagedResult<TokenDto>> {
        const q = query.trim();
        const where = {
            isSecondPart,
            ...(q && { note: { contains: q, mode: "insensitive" as const } }),
        };

        const [tokens, total] = await Promise.all([
            this.prisma.token.findMany({
                where,
                orderBy: { createdAt: order === "asc" ? "asc" : "desc" },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.token.count({ where }),
        ]);

        return {
            data: tokens.map((t) => this.map(t)),
            meta: { page, limit, total, pageCount: Math.ceil(total / limit) },
        };
    }

    async getOne(id: string): Promise<TokenDto> {
        const record = await this.prisma.token.findUnique({ where: { id } });
        if (!record) throw new NotFoundException();
        return this.map(record);
    }

    // Публичный контекст: платформа. Одна проверка для обеих частей сайта.
    async verify(token: string): Promise<TokenContextDto> {
        const record = await this.prisma.token.findUnique({ where: { token } });
        if (!record) throw new NotFoundException();
        return { type: this.toDtoType(record.type) };
    }

    async create({
        note,
        type,
        isSecondPart,
    }: CreateTokenDtoOutput): Promise<TokenDto> {
        const token = randomUUID();
        // 2-я панель всегда android — форсим на бэке независимо от тела.
        const created = await this.prisma.token.create({
            data: {
                token,
                note: note ?? null,
                type: isSecondPart ? "ANDROID" : this.toPrismaType(type),
                isSecondPart,
            },
        });

        return this.map(created);
    }

    async delete(id: string): Promise<void> {
        const token = await this.prisma.token.findUnique({ where: { id } });
        if (!token) throw new NotFoundException();
        await this.prisma.token.delete({ where: { id } });
    }

    async updateNote(
        id: string,
        { note }: UpdateNoteTokenDtoOutput,
    ): Promise<TokenDto> {
        const token = await this.prisma.token.findUnique({ where: { id } });
        if (!token) throw new NotFoundException();

        const updated = await this.prisma.token.update({
            where: { id },
            data: { note: note ?? null },
        });

        return this.map(updated);
    }

    async updateType(
        id: string,
        { type }: UpdateTypeTokenDtoOutput,
    ): Promise<TokenDto> {
        const token = await this.prisma.token.findUnique({ where: { id } });
        if (!token) throw new NotFoundException();
        // 2-я часть залочена на android — тип менять нельзя.
        if (token.isSecondPart) return this.map(token);

        const updated = await this.prisma.token.update({
            where: { id },
            data: { type: this.toPrismaType(type) },
        });

        return this.map(updated);
    }
}
