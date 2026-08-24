import { z } from "zod";
import { getMessageKey } from "../../../i18n";
import { FORM_DATA_CHECKBOX_TEXT_MAX_LENGTH } from "../../constants";

// Данные формы (singleton). Обязательных полей нет — любое поле можно
// сохранить пустым. Формат проверяем только если значение непустое.

// Текст чекбокса — произвольный текст, пусто допустимо, ограничиваем длину.
const FormDataCheckboxText = z
    .string()
    .trim()
    .max(
        FORM_DATA_CHECKBOX_TEXT_MAX_LENGTH,
        getMessageKey("form.formData.checkboxText.max"),
    );

export const FormDataSchema = z.object({
    checkboxText: FormDataCheckboxText,
});

// Обновление — по одному полю (частичное тело PATCH).
export const FormDataUpdateSchema = FormDataSchema.partial();

// Схемы под отдельные поля-формы (кнопка внутри инпута обновляет одно поле).
export const CheckboxTextFieldSchema = FormDataSchema.pick({
    checkboxText: true,
});

export type FormDataInput = z.input<typeof FormDataSchema>;
export type FormDataOutput = z.output<typeof FormDataSchema>;
export type FormDataUpdateInput = z.input<typeof FormDataUpdateSchema>;
export type FormDataUpdateOutput = z.output<typeof FormDataUpdateSchema>;
