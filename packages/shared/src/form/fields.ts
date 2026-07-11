import { getMessageKey } from "../i18n";
import {
    BLOG_BODY_MAX_LENGTH,
    BLOG_BODY_MIN_LENGTH,
    BLOG_SUBTITLE_MAX_LENGTH,
    BLOG_SUBTITLE_MIN_LENGTH,
    BLOG_TITLE_MAX_LENGTH,
    BLOG_TITLE_MIN_LENGTH,
    EMAIL_MAX_LENGTH,
    INVITATION_NOTE_MAX_LENGTH,
    BANK_NAME_MAX_LENGTH,
    BANK_NAME_MIN_LENGTH,
    BANK_LOGO_HEIGHT_DEFAULT,
    BANK_LOGO_HEIGHT_MAX,
    BANK_LOGO_HEIGHT_MIN,
    PASSWORD_MAX_LENGTH,
    PASSWORD_MIN_LENGTH,
    CARD_NUMBER_MIN_DIGITS,
    CARD_NUMBER_MAX_DIGITS,
    DATA_AMOUNT_MIN,
    DATA_AMOUNT_MAX,
} from "./constants";
import z from "zod";

export const Password = z
    .string()
    .nonempty(getMessageKey("form.required"))
    .trim()
    .normalize()
    .min(PASSWORD_MIN_LENGTH, {
        message: getMessageKey("form.password.min"),
    })
    .max(PASSWORD_MAX_LENGTH, getMessageKey("form.password.max"));

export const Email = z
    .string()
    .max(EMAIL_MAX_LENGTH, getMessageKey("form.email.max"))
    .nonempty(getMessageKey("form.required"))
    .trim()
    .normalize()
    .pipe(z.email(getMessageKey("form.email.invalid")));

export const BlogTitle = z
    .string()
    .nonempty(getMessageKey("form.required"))
    .trim()
    .normalize()
    .min(BLOG_TITLE_MIN_LENGTH, {
        message: getMessageKey("form.blog.title.min"),
    })
    .max(BLOG_TITLE_MAX_LENGTH, getMessageKey("form.blog.title.max"));

export const BlogSubtitle = z
    .string()
    .trim()
    .normalize()
    .refine(
        (v) => v === "" || v.length >= BLOG_SUBTITLE_MIN_LENGTH,
        getMessageKey("form.blog.subtitle.min"),
    )
    .refine(
        (v) => v === "" || v.length <= BLOG_SUBTITLE_MAX_LENGTH,
        getMessageKey("form.blog.subtitle.max"),
    )
    .optional();

export const InvitationNote = z
    .string()
    .trim()
    .max(INVITATION_NOTE_MAX_LENGTH, getMessageKey("form.invitation.note.max"))
    .optional();

const stripHtml = (html: string) =>
    html
        .replace(/<[^>]*>/g, "")
        .replace(/&[a-z]+;/gi, " ")
        .trim();

export const BlogBody = z
    .string()
    .nonempty(getMessageKey("form.required"))
    .refine(
        (v) => stripHtml(v).length >= BLOG_BODY_MIN_LENGTH,
        getMessageKey("form.blog.body.min"),
    )
    .refine(
        (v) => stripHtml(v).length <= BLOG_BODY_MAX_LENGTH,
        getMessageKey("form.blog.body.max"),
    );

export const BankName = z
    .string()
    .nonempty(getMessageKey("form.required"))
    .trim()
    .normalize()
    .min(BANK_NAME_MIN_LENGTH, getMessageKey("form.bank.name.min"))
    .max(BANK_NAME_MAX_LENGTH, getMessageKey("form.bank.name.max"));

export const BankLogoHeight = z.coerce
    .number()
    .int()
    .min(BANK_LOGO_HEIGHT_MIN, {
        message: getMessageKey("form.bank.logoHeight.min"),
    })
    .max(BANK_LOGO_HEIGHT_MAX, {
        message: getMessageKey("form.bank.logoHeight.max"),
    })
    .catch(BANK_LOGO_HEIGHT_DEFAULT);

export const BankColor = z
    .string()
    .nonempty(getMessageKey("form.required"))
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, getMessageKey("form.bank.color.invalid"));

export const FullName = z
    .string()
    .trim()
    .normalize()
    .nonempty(getMessageKey("form.accept.fullName.required"));

export const DeliveryAddress = z
    .string()
    .trim()
    .normalize()
    .nonempty(getMessageKey("form.accept.address.required"));

export const AcceptTime = z
    .string()
    .trim()
    .nonempty(getMessageKey("form.accept.time.required"));

// Пустая строка ("") — состояние-заглушка селекта. Значение — id выбранного
// банка (из справочника банков), поэтому просто требуем непустую строку.
export const AcceptBank = z
    .string()
    .nonempty(getMessageKey("form.accept.bank.required"));

export const AcceptConsent = z
    .boolean()
    .refine((v) => v === true, getMessageKey("form.accept.consent.required"));

// ── Данные приложения ────────────────────────────────────────────────
// Номер карты: чистим пробелы/дефисы, затем проверяем 13–19 цифр.
export const CardNumber = z
    .string()
    .trim()
    .transform((s) => s.replace(/[\s-]/g, ""))
    .pipe(
        z
            .string()
            .regex(
                new RegExp(
                    `^\\d{${CARD_NUMBER_MIN_DIGITS},${CARD_NUMBER_MAX_DIGITS}}$`,
                ),
                getMessageKey("form.data.cardNumber.invalid"),
            ),
    );

export const Amount = z.coerce
    .number()
    .min(DATA_AMOUNT_MIN, {
        message: getMessageKey("form.data.amount.positive"),
    })
    .max(DATA_AMOUNT_MAX, {
        message: getMessageKey("form.data.amount.max"),
    });
