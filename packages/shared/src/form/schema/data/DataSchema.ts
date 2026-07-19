import { z } from "zod";
import { getMessageKey } from "../../../i18n";
import {
    CARD_NUMBER_MAX_LENGTH,
    DATA_AMOUNT_MAX,
    PHONE_MAX_LENGTH,
} from "../../constants";

// Данные приложения (singleton). Обязательных полей нет — любое поле можно
// сохранить пустым. Формат проверяем только если значение непустое.

// ФИО — просто чистим строку, пусто допустимо.
const DataFullName = z.string().trim().normalize();

// Продавец — просто чистим строку, пусто допустимо.
const DataSeller = z.string().trim().normalize();

// Коды — чистим строку, пусто допустимо.
const DataAuthorization = z.string().trim();
const DataConfirmation = z.string().trim();

// Телефон — пусто допустимо, ограничиваем длину.
const DataPhone = z
    .string()
    .trim()
    .max(PHONE_MAX_LENGTH, getMessageKey("form.data.phone.max"));

// Номер счета — произвольный текст, пусто допустимо, ограничиваем длину.
const DataCardNumber = z
    .string()
    .trim()
    .max(CARD_NUMBER_MAX_LENGTH, getMessageKey("form.data.cardNumber.max"));

// Сумма — пусто трактуем как 0; иначе число в диапазоне [0, MAX].
const DataAmount = z
    .string()
    .trim()
    .transform((s) => (s === "" ? 0 : Number(s)))
    .pipe(
        z
            .number()
            .min(0, { message: getMessageKey("form.data.amount.positive") })
            .max(DATA_AMOUNT_MAX, {
                message: getMessageKey("form.data.amount.max"),
            }),
    );

export const DataSchema = z.object({
    cardNumber: DataCardNumber,
    phone: DataPhone,
    amount: DataAmount,
    fullName: DataFullName,
    seller: DataSeller,
    authorization: DataAuthorization,
    confirmation: DataConfirmation,
});

// Обновление — по одному полю (частичное тело PATCH).
export const DataUpdateSchema = DataSchema.partial();

// Схемы под отдельные поля-формы (кнопка внутри инпута обновляет одно поле).
export const CardNumberFieldSchema = DataSchema.pick({ cardNumber: true });
export const PhoneFieldSchema = DataSchema.pick({ phone: true });
export const AmountFieldSchema = DataSchema.pick({ amount: true });
export const FullNameFieldSchema = DataSchema.pick({ fullName: true });
export const SellerFieldSchema = DataSchema.pick({ seller: true });
export const AuthorizationFieldSchema = DataSchema.pick({ authorization: true });
export const ConfirmationFieldSchema = DataSchema.pick({ confirmation: true });

export type DataInput = z.input<typeof DataSchema>;
export type DataOutput = z.output<typeof DataSchema>;
export type DataUpdateInput = z.input<typeof DataUpdateSchema>;
export type DataUpdateOutput = z.output<typeof DataUpdateSchema>;
