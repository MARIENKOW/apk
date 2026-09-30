import type { Lead, LeadNote } from "@/generated/prisma";
import { LeadGroup, LeadStatus } from "@/generated/prisma";
import type { InlineKeyboardModel } from "@/infrastructure/telegram/telegram.types";
import { LeadAction, encodeCallback } from "@/modules/accept/lead.callback";

const DIVIDER = "──────────";

/** Экранирование пользовательского текста под parse_mode: HTML. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function statusLabel(status: LeadStatus): string {
  return status === LeadStatus.IN_PROGRESS ? "🔵 В работе" : "🟡 Новая";
}

function methodLabel(method: string): string {
  if (method === "courier") return "Курьер";
  if (method === "branch") return "Отделение";
  return method;
}

/** Тело карточки — одинаково для обеих групп. */
export function renderCardText(lead: Lead, notes: LeadNote[]): string {
  const field = (label: string, value: string): string | null =>
    value.trim() ? `<b>${label}:</b> ${escapeHtml(value)}` : null;

  const header: string[] = [
    `📩 <b>Заявка #${lead.seq}</b>`,
    `Статус: ${statusLabel(lead.status)}`,
  ];
  if (lead.assignedName) {
    header.push(`Клозер: ${escapeHtml(lead.assignedName)}`);
  }

  const body = [
    field("Имя Фамилия", lead.fullName),
    field("Номер паспорта", lead.passportNumber),
    field("Телефон", lead.phone),
    field("Способ", methodLabel(lead.method)),
    field("Адрес", lead.address),
    field("Интервал", lead.time),
    field("Банк", lead.bankName),
    field("Тип", lead.type),
  ].filter(Boolean) as string[];

  const sections = [header.join("\n"), body.join("\n")];

  if (notes.length > 0) {
    const list = notes
      .map((n) => `• <b>${escapeHtml(n.authorName)}:</b> ${escapeHtml(n.text)}`)
      .join("\n");
    sections.push(`<b>Дополнительная информация:</b>\n${list}`);
  }

  return sections.join(`\n${DIVIDER}\n`);
}

/**
 * Клавиатура карточки по роли группы и статусу.
 *   CLOSERS + NEW → «Взять в работу»; после клейма кнопок нет.
 *   GENERAL       → «Дополнить» всегда.
 * Возвращает [] для сброса клавиатуры (grammy уберёт кнопки).
 */
export function renderCardKeyboard(
  leadId: string,
  group: LeadGroup,
  status: LeadStatus,
): InlineKeyboardModel {
  if (group === LeadGroup.CLOSERS) {
    return status === LeadStatus.NEW
      ? [
          [
            {
              text: "✅ Взять в работу",
              data: encodeCallback(LeadAction.Take, leadId),
            },
          ],
        ]
      : [];
  }
  return [
    [{ text: "➕ Дополнить", data: encodeCallback(LeadAction.Add, leadId) }],
  ];
}

/** Текст промпта дополнения с пингом инициатора. */
export function renderPromptText(
  userId: string,
  userName: string,
  seq: number,
): string {
  const mention = `<a href="tg://user?id=${userId}">${escapeHtml(userName)}</a>`;
  return `${mention}, ответьте на это сообщение текстом дополнения к заявке #${seq}.`;
}

/** Клавиатура промпта: «Отменить» всегда, «Очистить всё» — если есть что чистить. */
export function renderPromptKeyboard(
  leadId: string,
  hasNotes: boolean,
): InlineKeyboardModel {
  const row = [
    { text: "❌ Отменить", data: encodeCallback(LeadAction.Cancel, leadId) },
  ];
  if (hasNotes) {
    row.push({
      text: "🧹 Очистить всё",
      data: encodeCallback(LeadAction.ClearOpen, leadId),
    });
  }
  return [row];
}

/** Клавиатура подтверждения очистки. */
export function renderClearConfirmKeyboard(
  leadId: string,
): InlineKeyboardModel {
  return [
    [
      {
        text: "✅ Да, очистить",
        data: encodeCallback(LeadAction.ClearConfirm, leadId),
      },
      {
        text: "↩️ Нет",
        data: encodeCallback(LeadAction.ClearAbort, leadId),
      },
    ],
  ];
}
