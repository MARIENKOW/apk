import {
    AlertMessage,
    AlertSender,
    AlertButtonLabel,
    AlertButtonUrl,
} from "../../fields";
import { getMessageKey } from "../../../i18n";
import z from "zod";

// Вид подачи алерта: sms — пуш-баннер (прежнее поведение), alert — модалка с кнопкой.
export const AlertKindEnum = z.enum(["sms", "alert"]);

// Отправка алерта: то, что вводит админ в форме.
// continueTokenId в схему НЕ входит — он приходит из контекста, не из формы.
// kind/кнопка едут как обычные поля рядом с message/sender; способ отправки не меняется.
export const SendAlertSchema = z
    .object({
        message: AlertMessage,
        sender: AlertSender,
        kind: AlertKindEnum.default("sms"),
        useCustomButton: z.boolean().default(false),
        buttonLabel: AlertButtonLabel.optional().or(z.literal("")),
        buttonUrl: AlertButtonUrl.optional().or(z.literal("")),
    })
    .superRefine((v, ctx) => {
        // Название кнопки обязательно только в режиме алерта с включённой кастомной кнопкой.
        if (
            v.kind === "alert" &&
            v.useCustomButton &&
            (!v.buttonLabel || !v.buttonLabel.trim())
        ) {
            ctx.addIssue({
                path: ["buttonLabel"],
                code: z.ZodIssueCode.custom,
                message: getMessageKey("form.alert.buttonLabel.required"),
            });
        }
    });

export type SendAlertDtoInput = z.input<typeof SendAlertSchema>;
export type SendAlertDtoOutput = z.infer<typeof SendAlertSchema>;
