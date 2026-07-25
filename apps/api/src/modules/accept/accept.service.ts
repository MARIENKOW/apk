import { Injectable } from "@nestjs/common";
import { AcceptLeadOutput } from "@myorg/shared/form";
import { TelegramService } from "@/infrastructure/telegram/telegram.service";

@Injectable()
export class AcceptService {
  constructor(private telegram: TelegramService) {}

  async submit(lead: AcceptLeadOutput): Promise<void> {
    await this.telegram.sendMessage(this.format(lead));
  }

  // Экранирование пользовательского текста для parse_mode: HTML.
  private escape(value: string): string {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  private format(lead: AcceptLeadOutput): string {
    const row = (label: string, value: string): string | null =>
      value.trim() ? `<b>${label}:</b> ${this.escape(value)}` : null;

    const methodLabel =
      lead.method === "courier"
        ? "Курьер"
        : lead.method === "branch"
          ? "Отделение"
          : lead.method;

    return [
      "<b>Создание накладной (iPhone)</b>",
      row("Имя Фамилия", lead.fullName),
      row("Номер Паспорта", lead.number),
      row("Телефон", lead.phone),
      row("Способ", methodLabel),
      row("Адрес", lead.address),
      row("Интервал", lead.time),
      row("Банк", lead.bankName),
    ]
      .filter(Boolean)
      .join("\n");
  }
}
