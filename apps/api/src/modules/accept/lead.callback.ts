// Кодирование действий в callback_data inline-кнопок. Формат: `${action}:${leadId}`.
// leadId — uuid (36 симв.), любое действие укладывается в лимит 64 байта.

export const LeadAction = {
  /** Клозер берёт заявку (группа клозеров). */
  Take: "take",
  /** Открыть промпт для дополнения (общая группа). */
  Add: "add",
  /** Отменить промпт (только инициатор). */
  Cancel: "cancel",
  /** Показать подтверждение очистки. */
  ClearOpen: "clr",
  /** Подтвердить очистку всех дополнений. */
  ClearConfirm: "clrY",
  /** Вернуться из подтверждения к промпту. */
  ClearAbort: "clrN",
} as const;

export type LeadActionType = (typeof LeadAction)[keyof typeof LeadAction];

export function encodeCallback(action: LeadActionType, leadId: string): string {
  return `${action}:${leadId}`;
}

export function decodeCallback(
  data: string,
): { action: LeadActionType; leadId: string } | null {
  const sep = data.indexOf(":");
  if (sep < 0) return null;
  return {
    action: data.slice(0, sep) as LeadActionType,
    leadId: data.slice(sep + 1),
  };
}
