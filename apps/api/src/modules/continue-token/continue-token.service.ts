import {
    ConflictException,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "@/infrastructure/prisma/prisma.service";
import { RequestContextService } from "@/common/request-context/request-context.service";
import { ContinueTokenDto } from "@myorg/shared/dto";
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
            url: this.buildUrl(t.token),
            createdAt: t.createdAt.toISOString(),
        };
    }

    async get(): Promise<ContinueTokenDto | null> {
        const record = await this.prisma.continueToken.findFirst();
        return record ? this.map(record) : null;
    }

    async verify(token: string): Promise<void> {
        const record = await this.prisma.continueToken.findUnique({
            where: { token },
        });
        if (!record) throw new NotFoundException();
    }

    async create(): Promise<ContinueTokenDto> {
        const existing = await this.prisma.continueToken.count();
        if (existing > 0) throw new ConflictException();

        const token = randomUUID();
        const created = await this.prisma.continueToken.create({
            data: { token },
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
}
