import z from "zod";

/**
 * Payload заявки, отправляемой в Telegram (только для iphone-флоу).
 * По банку отправляем имя (bankName), а не id/полные данные.
 */
export const AcceptLeadSchema = z.object({
    fullName: z.string().trim(),
    number: z.string().trim(),
    phone: z.string().trim(),
    method: z.string().trim(),
    address: z.string().trim(),
    time: z.string().trim(),
    bankName: z.string().trim(),
});

export type AcceptLeadInput = z.input<typeof AcceptLeadSchema>;
export type AcceptLeadOutput = z.infer<typeof AcceptLeadSchema>;
