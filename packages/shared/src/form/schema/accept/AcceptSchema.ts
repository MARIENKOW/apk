import {
    AcceptBank,
    AcceptConsent,
    AcceptMethod,
    DeliveryAddress,
    FullName,
} from "../../fields";
import { getMessageKey } from "../../../i18n";
import z from "zod";

export const AcceptSchema = z
    .object({
        fullName: FullName,
        method: AcceptMethod,
        address: DeliveryAddress,
        // Временной интервал: обязателен только для курьера (см. superRefine).
        time: z.string().trim(),
        bank: AcceptBank,
        consent: AcceptConsent,
    })
    .superRefine((val, ctx) => {
        if (val.method === "courier" && !val.time.trim()) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["time"],
                message: getMessageKey("form.accept.time.required"),
            });
        }
    });

export type AcceptDtoInput = z.input<typeof AcceptSchema>;
export type AcceptDtoOutput = z.infer<typeof AcceptSchema>;
