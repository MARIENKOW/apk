import { Module } from "@nestjs/common";
import { TelegramModule } from "@/infrastructure/telegram/telegram.module";
import { LeadService } from "@/modules/accept/lead.service";
import { AcceptController } from "@/modules/accept/accept.controller";

@Module({
  imports: [TelegramModule],
  providers: [LeadService],
  controllers: [AcceptController],
})
export class AcceptModule {}
