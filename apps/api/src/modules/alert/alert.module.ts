import { Module } from "@nestjs/common";
import { PrismaModule } from "@/infrastructure/prisma/prisma.module";
import { AlertService } from "@/modules/alert/alert.service";
import { AlertBusService } from "@/modules/alert/alert-bus.service";
import { VisitService } from "@/modules/alert/visit.service";
import { AlertController } from "@/modules/alert/alert.controller";

@Module({
    imports: [PrismaModule],
    providers: [AlertService, AlertBusService, VisitService],
    controllers: [AlertController],
    exports: [AlertService, AlertBusService, VisitService],
})
export class AlertModule {}
