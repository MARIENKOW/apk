import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import * as fs from "fs/promises";
import { createReadStream, ReadStream } from "fs";
import * as path from "path";
import { randomUUID } from "crypto";

import { PrismaService } from "@/infrastructure/prisma/prisma.service";
import { FileDto } from "@myorg/shared/dto";
import { AppFile, FileEntityType } from "@/generated/prisma";
import {
    buildFileUrl,
    resolveFolder,
} from "@/infrastructure/file/file.utils";

// Одиночный файл для скачивания хранится в общей файловой инфраструктуре
// (папка/URL/статика — через FILE_CONFIG), но своей таблицей AppFile.
const ENTITY = FileEntityType.DOWNLOAD;

@Injectable()
export class AppFileService {
    private readonly logger = new Logger(AppFileService.name);

    constructor(private prisma: PrismaService) {}

    private map(f: AppFile): FileDto {
        return {
            id: f.id,
            url: buildFileUrl(ENTITY, f.filename),
            originalName: f.originalName,
            mimeType: f.mimeType,
            size: f.size,
            createdAt: f.createdAt.toISOString(),
        };
    }

    async getCurrent(): Promise<FileDto | null> {
        const file = await this.prisma.appFile.findFirst({
            orderBy: { createdAt: "desc" },
        });
        return file ? this.map(file) : null;
    }

    // Поток файла + метаданные для скачивания (Content-Disposition в контроллере).
    async getDownload(): Promise<{ stream: ReadStream; file: AppFile }> {
        const file = await this.prisma.appFile.findFirst({
            orderBy: { createdAt: "desc" },
        });
        if (!file) throw new NotFoundException();

        const filePath = path.join(resolveFolder(ENTITY), file.filename);
        return { stream: createReadStream(filePath), file };
    }

    async upload(file: Express.Multer.File): Promise<FileDto> {
        const folder = resolveFolder(ENTITY);
        await fs.mkdir(folder, { recursive: true });

        const ext = path.extname(file.originalname);
        const filename = `${randomUUID()}${ext}`;
        const dest = path.join(folder, filename);

        // Прежние записи (singleton) — удалим после успешной загрузки нового.
        const existing = await this.prisma.appFile.findMany();

        // Stage 1: пишем новый файл на диск
        await fs.writeFile(dest, file.buffer);

        // Stage 2: сохраняем запись в БД, при ошибке — откатываем файл
        let created: AppFile;
        try {
            created = await this.prisma.appFile.create({
                data: {
                    filename,
                    originalName: file.originalname,
                    mimeType: file.mimetype,
                    size: file.size,
                },
            });
        } catch (err) {
            await fs.unlink(dest).catch(() => undefined);
            throw err;
        }

        // Stage 3: чистим прежние — ошибки не критичны, только логируем
        await Promise.all(
            existing.map((e) =>
                this.removeRecord(e).catch((err) =>
                    this.logger.warn(
                        `Failed to cleanup old file: ${e.filename}`,
                        err,
                    ),
                ),
            ),
        );

        return this.map(created);
    }

    async delete(): Promise<void> {
        const files = await this.prisma.appFile.findMany();
        if (files.length === 0) throw new NotFoundException();
        await Promise.all(files.map((f) => this.removeRecord(f)));
    }

    // БД удаляем первой: если упадёт — файл цел, сирот-записи не остаётся.
    private async removeRecord(file: AppFile): Promise<void> {
        await this.prisma.appFile.delete({ where: { id: file.id } });
        await fs
            .unlink(path.join(resolveFolder(ENTITY), file.filename))
            .catch((e) =>
                this.logger.warn(`Failed to delete file: ${file.filename}`, e),
            );
    }
}
