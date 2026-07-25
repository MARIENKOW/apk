import { Module } from "@nestjs/common";
import { TelegramModule } from "@/infrastructure/telegram/telegram.module";
import { AcceptService } from "@/modules/accept/accept.service";
import { AcceptController } from "@/modules/accept/accept.controller";

@Module({
  imports: [TelegramModule],
  providers: [AcceptService],
  controllers: [AcceptController],
})
export class AcceptModule {}
