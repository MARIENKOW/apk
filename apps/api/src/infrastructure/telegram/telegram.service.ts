import { Injectable, Logger } from "@nestjs/common";
import { env } from "@/config";

/**
 * Переиспользуемый сервис отправки сообщений в Telegram через бота.
 * chat_id и токен берутся из env. Ошибки логируются, но не пробрасываются —
 * недоступность Telegram не должна ломать пользовательский флоу.
 */
@Injectable()
export class TelegramService {
  private readonly logger = new Logger(TelegramService.name);
  private readonly url = `https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`;

  async sendMessage(text: string): Promise<void> {
    try {
      const res = await fetch(this.url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: env.TELEGRAM_CHAT_ID,
          text,
          parse_mode: "HTML",
          disable_web_page_preview: true,
        }),
      });

      if (!res.ok) {
        const detail = await res.text().catch(() => "");
        this.logger.error(
          `Telegram sendMessage failed: ${res.status} ${detail}`,
        );
      }
    } catch (error) {
      this.logger.error("Telegram sendMessage error", error as Error);
    }
  }
}
