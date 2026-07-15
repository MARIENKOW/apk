import { z } from "zod";
import { getMessageKey } from "../../../i18n";

// Форма страницы авторизации по коду: телефон + код.
// Код сверяется на сервере с кодом авторизации (singleton AppData).
// Валидация — только обязательность полей.

const CodePhone = z
    .string()
    .trim()
    .min(1, getMessageKey("form.codeAuth.phone.required"));

const CodeValue = z
    .string()
    .trim()
    .min(1, getMessageKey("form.codeAuth.code.required"));

export const CodeAuthorizationSchema = z.object({
    phone: CodePhone,
    code: CodeValue,
});

export type CodeAuthorizationInput = z.input<typeof CodeAuthorizationSchema>;
export type CodeAuthorizationOutput = z.output<typeof CodeAuthorizationSchema>;
