import { Module } from "@nestjs/common";
import { PrismaModule } from "@/infrastructure/prisma/prisma.module";
import { ParcelService } from "@/modules/parcel/parcel.service";
import { ParcelController } from "@/modules/parcel/parcel.controller";

@Module({
    imports: [PrismaModule],
    providers: [ParcelService],
    controllers: [ParcelController],
    exports: [ParcelService],
})
export class ParcelModule {}
