import { Module } from "@nestjs/common";
import { TelegramBotService } from "@/infrastructure/telegram/telegram.service";

@Module({
  providers: [TelegramBotService],
  exports: [TelegramBotService],
})
export class TelegramModule {}
