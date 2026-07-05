import { FileEntityType } from "@/generated/prisma";
import { PrismaService } from "@/infrastructure/prisma/prisma.service";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { LandingDto, PagedResult } from "@myorg/shared/dto";
import { ImageService } from "@/infrastructure/file/img/image.service";
import { LandingWithoutImagesOutput } from "@myorg/shared/form";
import { mapLanding } from "@/modules/landing/landing.mapper";
import {
    LandingFiles,
    LandingUpdateFiles,
} from "@/infrastructure/file/img/pipes/landingImages.pipe";

const LANDING_INCLUDE = {
    icon: true,
    logo: true,
    background: true,
} as const;

@Injectable()
export class LandingService {
    constructor(
        private prisma: PrismaService,
        private image: ImageService,
    ) {}
    private readonly logger = new Logger(LandingService.name);

    async create(
        body: LandingWithoutImagesOutput,
        files: LandingFiles,
    ): Promise<LandingDto> {
        const uploaded: string[] = [];
        try {
            const iconDto = files.icon
                ? await this.image.upload(
                      files.icon,
                      FileEntityType.LANDING_ICON,
                      { mode: "original" },
                  )
                : null;
            if (iconDto) uploaded.push(iconDto.id);

            const logoDto = await this.image.upload(
                files.logo,
                FileEntityType.LANDING_LOGO,
                { mode: "original" },
            );
            uploaded.push(logoDto.id);

            const backgroundDto = await this.image.upload(
                files.background,
                FileEntityType.LANDING_BACKGROUND,
                { mode: "original" },
            );
            uploaded.push(backgroundDto.id);
            const {
                logoHeight,
                title,
                metaTitle,
                subtitle,
                btnName,
                color,
                phone,
            } = body;
            const landing = await this.prisma.landing.create({
                data: {
                    metaTitle,
                    subtitle,
                    title,
                    logoHeight,
                    btnName,
                    color,
                    phone,
                    ...(iconDto ? { iconId: iconDto.id } : {}),
                    logoId: logoDto.id,
                    backgroundId: backgroundDto.id,
                },
                include: LANDING_INCLUDE,
            });

            return mapLanding(landing);
        } catch (error) {
            this.logger.error(
                `Failed to create landing, rolling back uploaded images`,
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
        data: LandingWithoutImagesOutput;
        files: LandingUpdateFiles;
    }): Promise<LandingDto> {
        const landing = await this.prisma.landing.findUnique({ where: { id } });
        if (!landing) throw new NotFoundException();

        const newIds: Record<string, string> = {};
        const uploadedForRollback: string[] = [];
        let iconRemoved = false;

        try {
            if (files.icon) {
                const dto = await this.image.upload(
                    files.icon,
                    FileEntityType.LANDING_ICON,
                    { mode: "original" },
                );
                newIds.iconId = dto.id;
                uploadedForRollback.push(dto.id);
            } else if (!data.icon && landing.iconId) {
                iconRemoved = true;
            }
            if (files.logo) {
                const dto = await this.image.upload(
                    files.logo,
                    FileEntityType.LANDING_LOGO,
                    { mode: "original" },
                );
                newIds.logoId = dto.id;
                uploadedForRollback.push(dto.id);
            }
            if (files.background) {
                const dto = await this.image.upload(
                    files.background,
                    FileEntityType.LANDING_BACKGROUND,
                    { mode: "original" },
                );
                newIds.backgroundId = dto.id;
                uploadedForRollback.push(dto.id);
            }

            const {
                logoHeight,
                title,
                metaTitle,
                subtitle,
                btnName,
                color,
                phone,
            } = data;

            const updated = await this.prisma.landing.update({
                where: { id },
                data: {
                    logoHeight,
                    title,
                    metaTitle,
                    subtitle,
                    btnName,
                    color,
                    phone,
                    ...newIds,
                    ...(iconRemoved ? { iconId: null } : {}),
                },
                include: LANDING_INCLUDE,
            });

            await Promise.allSettled([
                (newIds.iconId || iconRemoved) &&
                    landing.iconId &&
                    this.image
                        .delete(landing.iconId)
                        .catch((e) =>
                            this.logger.error(
                                `Old icon not removed [imageId=${landing.iconId}]`,
                                e,
                            ),
                        ),
                newIds.logoId &&
                    this.image
                        .delete(landing.logoId)
                        .catch((e) =>
                            this.logger.error(
                                `Old logo not removed [imageId=${landing.logoId}]`,
                                e,
                            ),
                        ),
                newIds.backgroundId &&
                    this.image
                        .delete(landing.backgroundId)
                        .catch((e) =>
                            this.logger.error(
                                `Old background not removed [imageId=${landing.backgroundId}]`,
                                e,
                            ),
                        ),
            ]);

            return mapLanding(updated);
        } catch (error) {
            this.logger.error(
                `Failed to update landing [id=${id}], rolling back uploaded images`,
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
    ): Promise<PagedResult<LandingDto>> {
        const ord = order === "asc" ? "asc" : "desc";
        const q = query.trim();

        const where = q
            ? {
                  OR: [
                      { title: { contains: q, mode: "insensitive" as const } },
                      {
                          subtitle: {
                              contains: q,
                              mode: "insensitive" as const,
                          },
                      },
                      {
                          metaTitle: {
                              contains: q,
                              mode: "insensitive" as const,
                          },
                      },
                  ],
              }
            : {};

        const [total, landings] = await Promise.all([
            this.prisma.landing.count({ where }),
            this.prisma.landing.findMany({
                where,
                include: LANDING_INCLUDE,
                orderBy: { createdAt: ord },
                skip: (page - 1) * limit,
                take: limit,
            }),
        ]);

        return {
            data: landings.map(mapLanding),
            meta: { page, limit, total, pageCount: Math.ceil(total / limit) },
        };
    }

    async get(id: string): Promise<LandingDto> {
        const data = await this.prisma.landing.findUnique({
            where: { id },
            include: LANDING_INCLUDE,
        });
        if (!data) throw new NotFoundException();
        return mapLanding(data);
    }

    async delete(id: string): Promise<void> {
        const landing = await this.prisma.landing.findUnique({
            where: { id },
            include: { icon: true, logo: true, background: true },
        });
        if (!landing) throw new NotFoundException();

        const { iconId, logoId, backgroundId } = landing;

        await this.prisma.landing.delete({ where: { id } });

        await Promise.allSettled([
            iconId &&
                this.image
                    .delete(iconId)
                    .catch((e) =>
                        this.logger.error(
                            `Landing [id=${id}] deleted but icon [imageId=${iconId}] was not removed.`,
                            e,
                        ),
                    ),
            this.image
                .delete(logoId)
                .catch((e) =>
                    this.logger.error(
                        `Landing [id=${id}] deleted but logo [imageId=${logoId}] was not removed.`,
                        e,
                    ),
                ),
            this.image
                .delete(backgroundId)
                .catch((e) =>
                    this.logger.error(
                        `Landing [id=${id}] deleted but background [imageId=${backgroundId}] was not removed.`,
                        e,
                    ),
                ),
        ]);
    }

    async deleteAll(): Promise<void> {
        const landings = await this.prisma.landing.findMany({
            include: { icon: true, logo: true, background: true },
        });

        const imageIds = landings.flatMap(
            (l) =>
                [l.iconId, l.logoId, l.backgroundId].filter(
                    Boolean,
                ) as string[],
        );

        await this.prisma.landing.deleteMany({
            where: { id: { in: landings.map((l) => l.id) } },
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
