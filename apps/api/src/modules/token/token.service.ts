import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "@/infrastructure/prisma/prisma.service";
import { RequestContextService } from "@/common/request-context/request-context.service";
import { TokenDto, PagedResult } from "@myorg/shared/dto";
import { UpdateNoteTokenDtoOutput } from "@myorg/shared/form";
import { Token } from "@/generated/prisma";
import { randomUUID } from "crypto";

@Injectable()
export class TokenService {
    constructor(
        private prisma: PrismaService,
        private requestContext: RequestContextService,
    ) {}

    private buildUrl(token: string): string {
        return `${this.requestContext.origin}/${token}`;
    }

    private map(t: Token): TokenDto {
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
    ): Promise<PagedResult<TokenDto>> {
        const q = query.trim();
        const where = {
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

    async verify(token: string): Promise<void> {
        const record = await this.prisma.token.findUnique({ where: { token } });
        if (!record) throw new NotFoundException();
    }

    async create({ note }: UpdateNoteTokenDtoOutput): Promise<TokenDto> {
        const token = randomUUID();
        const created = await this.prisma.token.create({
            data: { token, note: note ?? null },
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
}
