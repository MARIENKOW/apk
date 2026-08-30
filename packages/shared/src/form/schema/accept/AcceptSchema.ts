import {
    AcceptBank,
    AcceptConsent,
    AcceptMethod,
    DeliveryAddress,
    FullName,
} from "../../fields";
import { ContinueTokenTypeEnum } from "../continue-token/ContinueToken.schema";
import { getMessageKey } from "../../../i18n";
import z from "zod";

export const AcceptSchema = z
    .object({
        fullName: FullName,
        // Свободный текст; обязателен только для iphone (см. superRefine).
        number: z.string().trim().normalize(),
        method: AcceptMethod,
        address: DeliveryAddress,
        // Временной интервал: обязателен только для курьера (см. superRefine).
        time: z.string().trim(),
        bank: AcceptBank,
        consent: AcceptConsent,
        // Платформа токена — нужна для условной валидации поля "номер".
        type: ContinueTokenTypeEnum,
    })
    .superRefine((val, ctx) => {
        if (val.method === "courier" && !val.time.trim()) {
            ctx.addIssue({
                code: "custom",
                path: ["time"],
                message: getMessageKey("form.accept.time.required"),
            });
        }
        if (!val.number.trim()) {
            ctx.addIssue({
                code: "custom",
                path: ["number"],
                message: getMessageKey("form.accept.number.required"),
            });
        }
    });

export type AcceptDtoInput = z.input<typeof AcceptSchema>;
export type AcceptDtoOutput = z.infer<typeof AcceptSchema>;
