import { Auth } from "@/modules/auth/decorators/auth.decorator";
import { Public } from "@/modules/auth/decorators/public.decorator";
import { FileDto } from "@myorg/shared/dto";
import { ENDPOINT, FULL_PATH_ENDPOINT } from "@myorg/shared/endpoints";
import {
    Controller,
    Delete,
    Get,
    Post,
    UploadedFile,
    UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { memoryStorage } from "multer";
import { AppFileService } from "./appFile.service";
import { AnyFileValidationPipe } from "./appFile.pipe";

const { path } = FULL_PATH_ENDPOINT.file;
const { current } = ENDPOINT.file;

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
