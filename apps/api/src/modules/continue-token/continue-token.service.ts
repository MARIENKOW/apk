import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/infrastructure/prisma/prisma.service";
import { RequestContextService } from "@/common/request-context/request-context.service";
import { ContinueTokenDto, PagedResult } from "@myorg/shared/dto";
import { UpdateNoteContinueTokenDtoOutput } from "@myorg/shared/form";
import { FULL_PATH_ROUTE } from "@myorg/shared/route";
import { ContinueToken } from "@/generated/prisma";
import { env } from "@/config";
import { randomUUID } from "crypto";

@Injectable()
export class ContinueTokenService {
    constructor(
        private prisma: PrismaService,
        private requestContext: RequestContextService,
    ) {}

    private buildUrl(token: string): string {
        // Приоритет — APP_ORIGIN из env; иначе origin из контекста запроса.
        const origin = (
            env.APP_ORIGIN || this.requestContext.origin || ""
        ).replace(/\/$/, "");
        return `${origin}/${token}${FULL_PATH_ROUTE.continue.path}`;
    }

    private map(t: ContinueToken): ContinueTokenDto {
        return {
            id: t.id,
            token: t.token,
            note: t.note,
            url: this.buildUrl(t.token),
            createdAt: t.createdAt.toISOString(),
        };
    }

    async getAll(
        page: number,
        limit: number,
        order: string = "desc",
        query: string = "",
    ): Promise<PagedResult<ContinueTokenDto>> {
        const q = query.trim();
        const where = {
            ...(q && { note: { contains: q, mode: "insensitive" as const } }),
        };

        const [tokens, total] = await Promise.all([
            this.prisma.continueToken.findMany({
                where,
                orderBy: { createdAt: order === "asc" ? "asc" : "desc" },
                skip: (page - 1) * limit,
                take: limit,
            }),
            this.prisma.continueToken.count({ where }),
        ]);

        return {
            data: tokens.map((t) => this.map(t)),
            meta: { page, limit, total, pageCount: Math.ceil(total / limit) },
        };
    }

    async verify(token: string): Promise<void> {
        const record = await this.prisma.continueToken.findUnique({
            where: { token },
        });
        if (!record) throw new NotFoundException();
    }

    async create({
        note,
    }: UpdateNoteContinueTokenDtoOutput): Promise<ContinueTokenDto> {
        const token = randomUUID();
        const created = await this.prisma.continueToken.create({
            data: { token, note: note ?? null },
        });

        return this.map(created);
    }

    async delete(id: string): Promise<void> {
        const record = await this.prisma.continueToken.findUnique({
            where: { id },
        });
        if (!record) throw new NotFoundException();
        await this.prisma.continueToken.delete({ where: { id } });
    }

    async updateNote(
        id: string,
        { note }: UpdateNoteContinueTokenDtoOutput,
    ): Promise<ContinueTokenDto> {
        const record = await this.prisma.continueToken.findUnique({
            where: { id },
        });
        if (!record) throw new NotFoundException();

        const updated = await this.prisma.continueToken.update({
            where: { id },
            data: { note: note ?? null },
        });

        return this.map(updated);
    }
}
