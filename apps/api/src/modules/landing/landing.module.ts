import { PrismaModule } from "@/infrastructure/prisma/prisma.module";
import { Module } from "@nestjs/common";
import { LandingService } from "@/modules/landing/landing.service";
import { LandingController } from "@/modules/landing/landing.controller";
import { ImageModule } from "@/infrastructure/file/img/image.module";

@Module({
    imports: [PrismaModule, ImageModule],
    providers: [LandingService],
    controllers: [LandingController],
    exports: [LandingService],
})
export class LandingModule {}
