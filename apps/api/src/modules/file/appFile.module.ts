import { Module } from "@nestjs/common";
import { PrismaModule } from "@/infrastructure/prisma/prisma.module";
import { AppFileService } from "./appFile.service";
import { AppFileController } from "./appFile.controller";

// Статика папки download раздаётся автоматически в FileModule
// (по FILE_CONFIG → FILE_PUBLIC), отдельная регистрация не нужна.
@Module({
    imports: [PrismaModule],
    providers: [AppFileService],
    controllers: [AppFileController],
    exports: [AppFileService],
})
export class AppFileModule {}
