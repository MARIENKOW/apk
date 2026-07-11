import { FileEntityType } from "@/generated/prisma";
import { PrismaService } from "@/infrastructure/prisma/prisma.service";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { BankDto, PagedResult } from "@myorg/shared/dto";
import { ImageService } from "@/infrastructure/file/img/image.service";
import { BankWithoutImagesOutput } from "@myorg/shared/form";
import { mapBank } from "@/modules/bank/bank.mapper";
import {
    BankFiles,
    BankUpdateFiles,
} from "@/infrastructure/file/img/pipes/bankImages.pipe";

const BANK_INCLUDE = {
    logo: true,
} as const;

@Injectable()
export class BankService {
    constructor(
        private prisma: PrismaService,
        private image: ImageService,
    ) {}
    private readonly logger = new Logger(BankService.name);

    async create(
        body: BankWithoutImagesOutput,
        files: BankFiles,
    ): Promise<BankDto> {
        const uploaded: string[] = [];
        try {
            const logoDto = await this.image.upload(
                files.logo,
                FileEntityType.BANK_LOGO,
                { mode: "original" },
            );
            uploaded.push(logoDto.id);

            const { name, color, logoHeight } = body;
            const bank = await this.prisma.bank.create({
                data: {
                    name,
                    color,
                    logoHeight,
                    logoId: logoDto.id,
                },
                include: BANK_INCLUDE,
            });

            return mapBank(bank);
        } catch (error) {
            this.logger.error(
                `Failed to create bank, rolling back uploaded images`,
                error,
            );
            await Promise.allSettled(
                uploaded.map((id) =>
                    this.image
                        .delete(id)
                        .catch((e) =>
                            this.logger.error(
                                `Rollback failed: could not delete orphaned image [imageId=${id}]`,
                                e,
                            ),
                        ),
                ),
            );
            throw error;
        }
    }

    async update({
        id,
        data,
        files,
    }: {
        id: string;
        data: BankWithoutImagesOutput;
        files: BankUpdateFiles;
    }): Promise<BankDto> {
        const bank = await this.prisma.bank.findUnique({ where: { id } });
        if (!bank) throw new NotFoundException();

        const newIds: Record<string, string> = {};
        const uploadedForRollback: string[] = [];

        try {
            if (files.logo) {
                const dto = await this.image.upload(
                    files.logo,
                    FileEntityType.BANK_LOGO,
                    { mode: "original" },
                );
                newIds.logoId = dto.id;
                uploadedForRollback.push(dto.id);
            }

            const { name, color, logoHeight } = data;

            const updated = await this.prisma.bank.update({
                where: { id },
                data: {
                    name,
                    color,
                    logoHeight,
                    ...newIds,
                },
                include: BANK_INCLUDE,
            });

            await Promise.allSettled([
                newIds.logoId &&
                    this.image
                        .delete(bank.logoId)
                        .catch((e) =>
                            this.logger.error(
                                `Old logo not removed [imageId=${bank.logoId}]`,
                                e,
                            ),
                        ),
            ]);

            return mapBank(updated);
        } catch (error) {
            this.logger.error(
                `Failed to update bank [id=${id}], rolling back uploaded images`,
                error,
            );
            await Promise.allSettled(
                uploadedForRollback.map((imgId) =>
                    this.image
                        .delete(imgId)
                        .catch((e) =>
                            this.logger.error(
                                `Rollback failed: could not delete orphaned image [imageId=${imgId}]`,
                                e,
                            ),
                        ),
                ),
            );
            throw error;
        }
    }

    async getAll(
        page: number,
        limit: number,
        order: string = "desc",
        query: string = "",
    ): Promise<PagedResult<BankDto>> {
        const ord = order === "asc" ? "asc" : "desc";
        const q = query.trim();

        const where = q
            ? {
                  name: { contains: q, mode: "insensitive" as const },
              }
            : {};

        const [total, banks] = await Promise.all([
            this.prisma.bank.count({ where }),
            this.prisma.bank.findMany({
                where,
                include: BANK_INCLUDE,
                orderBy: { createdAt: ord },
                skip: (page - 1) * limit,
                take: limit,
            }),
        ]);

        return {
            data: banks.map(mapBank),
            meta: { page, limit, total, pageCount: Math.ceil(total / limit) },
        };
    }

    // Полный справочник банков без пагинации — для публичного выпадающего списка.
    async getAllPublic(): Promise<BankDto[]> {
        const banks = await this.prisma.bank.findMany({
            include: BANK_INCLUDE,
            orderBy: { name: "asc" },
        });
        return banks.map(mapBank);
    }

    async get(id: string): Promise<BankDto> {
        const data = await this.prisma.bank.findUnique({
            where: { id },
            include: BANK_INCLUDE,
        });
        if (!data) throw new NotFoundException();
        return mapBank(data);
    }

    async delete(id: string): Promise<void> {
        const bank = await this.prisma.bank.findUnique({
            where: { id },
            include: BANK_INCLUDE,
        });
        if (!bank) throw new NotFoundException();

        const { logoId } = bank;

        await this.prisma.bank.delete({ where: { id } });

        await this.image
            .delete(logoId)
            .catch((e) =>
                this.logger.error(
                    `Bank [id=${id}] deleted but logo [imageId=${logoId}] was not removed.`,
                    e,
                ),
            );
    }

    async deleteAll(): Promise<void> {
        const banks = await this.prisma.bank.findMany({
            include: BANK_INCLUDE,
        });

        const imageIds = banks.map((s) => s.logoId);

        await this.prisma.bank.deleteMany({
            where: { id: { in: banks.map((s) => s.id) } },
        });

        const results = await Promise.allSettled(
            imageIds.map((imageId) => this.image.delete(imageId)),
        );
        results.forEach((result, i) => {
            if (result.status === "rejected")
                this.logger.error(
                    `Orphaned image after deleteAll [imageId=${imageIds[i]}].`,
                    result.reason,
                );
        });
    }
}
