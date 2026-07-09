import { Module } from "@nestjs/common";
import { PrismaModule } from "@/infrastructure/prisma/prisma.module";
import { DataService } from "@/modules/data/data.service";
import { DataController } from "@/modules/data/data.controller";

@Module({
    imports: [PrismaModule],
    providers: [DataService],
    controllers: [DataController],
    exports: [DataService],
})
export class DataModule {}
