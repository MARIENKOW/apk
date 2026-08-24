import { Module } from "@nestjs/common";
import { PrismaModule } from "@/infrastructure/prisma/prisma.module";
import { FormDataService } from "@/modules/form-data/form-data.service";
import { FormDataController } from "@/modules/form-data/form-data.controller";

@Module({
    imports: [PrismaModule],
    providers: [FormDataService],
    controllers: [FormDataController],
    exports: [FormDataService],
})
export class FormDataModule {}
