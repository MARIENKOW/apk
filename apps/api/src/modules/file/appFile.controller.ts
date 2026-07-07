import { Auth } from "@/modules/auth/decorators/auth.decorator";
import { Public } from "@/modules/auth/decorators/public.decorator";
import { FileDto } from "@myorg/shared/dto";
import { ENDPOINT, FULL_PATH_ENDPOINT } from "@myorg/shared/endpoints";
import {
    Controller,
    Delete,
    Get,
    Post,
    Res,
    StreamableFile,
    UploadedFile,
    UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { Response } from "express";
import { AppFileService } from "./appFile.service";
import { AnyFileValidationPipe } from "./appFile.pipe";

const { path } = FULL_PATH_ENDPOINT.file;
const { current, download } = ENDPOINT.file;

@Controller(path)
export class AppFileController {
    constructor(private file: AppFileService) {}

    @Get()
    @Auth("ADMIN")
    async get(): Promise<FileDto | null> {
        return this.file.getCurrent();
    }

    // Публичный доступ — для кнопки «Скачать» на клиентской странице.
    @Get(current.path)
    @Public()
    async current(): Promise<FileDto | null> {
        return this.file.getCurrent();
    }

    // Публичное скачивание: стрим файла с принудительным attachment и
    // оригинальным именем (работает кросс-домен, поддерживает большие файлы).
    @Get(download.path)
    @Public()
    async download(
        @Res({ passthrough: true }) res: Response,
    ): Promise<StreamableFile> {
        const { stream, file } = await this.file.getDownload();

        // ASCII-фолбэк + RFC 5987 для юникод-имён
        const asciiName =
            file.originalName.replace(/[^\x20-\x7e]+/g, "_") || "download";
        res.set({
            "Content-Type": file.mimeType || "application/octet-stream",
            "Content-Disposition": `attachment; filename="${asciiName}"; filename*=UTF-8''${encodeURIComponent(
                file.originalName,
            )}`,
            "Content-Length": String(file.size),
        });

        return new StreamableFile(stream);
    }

    @Post()
    @UseInterceptors(FileInterceptor("file", { storage: memoryStorage() }))
    @Auth("ADMIN")
    async upload(
        @UploadedFile(new AnyFileValidationPipe())
        file: Express.Multer.File,
    ): Promise<FileDto> {
        return this.file.upload(file);
    }

    @Delete()
    @Auth("ADMIN")
    async delete(): Promise<void> {
        return this.file.delete();
    }
}
