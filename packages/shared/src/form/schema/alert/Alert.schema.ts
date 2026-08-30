import { AlertMessage, AlertSender } from "../../fields";
import z from "zod";

// Отправка алерта: то, что вводит админ в форме (2 поля).
// continueTokenId в схему НЕ входит — он приходит из контекста, не из формы.
export const SendAlertSchema = z.object({
    message: AlertMessage,
    sender: AlertSender,
});

export type SendAlertDtoInput = z.input<typeof SendAlertSchema>;
export type SendAlertDtoOutput = z.infer<typeof SendAlertSchema>;
