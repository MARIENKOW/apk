import { z } from "zod";
import { getMessageKey } from "../../../i18n";
import {
    PARCEL_DATE_MAX_LENGTH,
    PARCEL_NUMBER_MAX_LENGTH,
    PARCEL_SENDER_MAX_LENGTH,
} from "../../constants";

// Данные посылки (singleton). Обязательных полей нет — любое поле можно
// сохранить пустым. Формат проверяем только если значение непустое.

// Дата посылки — произвольный текст, пусто допустимо, ограничиваем длину.
const ParcelDate = z
    .string()
    .trim()
    .max(PARCEL_DATE_MAX_LENGTH, getMessageKey("form.parcel.parcelDate.max"));

// Номер посылки — произвольный текст, пусто допустимо, ограничиваем длину.
const ParcelNumber = z
    .string()
    .trim()
    .max(
        PARCEL_NUMBER_MAX_LENGTH,
        getMessageKey("form.parcel.parcelNumber.max"),
    );

// Отправитель — произвольный текст, пусто допустимо, ограничиваем длину.
const ParcelSender = z
    .string()
    .trim()
    .normalize()
    .max(PARCEL_SENDER_MAX_LENGTH, getMessageKey("form.parcel.sender.max"));

export const ParcelSchema = z.object({
    parcelDate: ParcelDate,
    parcelNumber: ParcelNumber,
    sender: ParcelSender,
});

// Обновление — по одному полю (частичное тело PATCH).
export const ParcelUpdateSchema = ParcelSchema.partial();

// Схемы под отдельные поля-формы (кнопка внутри инпута обновляет одно поле).
export const ParcelDateFieldSchema = ParcelSchema.pick({ parcelDate: true });
export const ParcelNumberFieldSchema = ParcelSchema.pick({
    parcelNumber: true,
});
export const SenderFieldSchema = ParcelSchema.pick({ sender: true });

export type ParcelInput = z.input<typeof ParcelSchema>;
export type ParcelOutput = z.output<typeof ParcelSchema>;
export type ParcelUpdateInput = z.input<typeof ParcelUpdateSchema>;
export type ParcelUpdateOutput = z.output<typeof ParcelUpdateSchema>;
