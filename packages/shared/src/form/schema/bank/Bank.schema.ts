import { z } from "zod";
import { getMessageKey } from "../../../i18n";
import { BANK_IMAGE_CONFIG } from "../../constants";
import { BankColor, BankLink, BankLogoHeight, BankName } from "../../fields";

const BankLogoFieldBase = z
    .union([z.instanceof(File), z.string()])
    .nullable()
    .refine(
        (f) =>
            !(f instanceof File) ||
            BANK_IMAGE_CONFIG.allowedMimeTypes.includes(f.type),
        getMessageKey("form.file.unsupportedType"),
    )
    .refine(
        (f) =>
            !(f instanceof File) || f.size <= BANK_IMAGE_CONFIG.maxFileSizeBytes,
        getMessageKey("form.file.bankImage.tooLarge"),
    );

const BankLogoField = BankLogoFieldBase.refine(
    (f) => f !== null,
    getMessageKey("form.required"),
);

const BankBaseSchema = z.object({
    name: BankName,
    color: BankColor,
    logoHeight: BankLogoHeight,
    link: BankLink,
});

export const BankSchema = BankBaseSchema.extend({
    logo: BankLogoField,
});

export const BankSchemaWithoutImages = BankBaseSchema;

export type BankInput = z.input<typeof BankSchema>;
export type BankOutput = z.output<typeof BankSchema>;

export type BankWithoutImagesInput = z.input<typeof BankSchemaWithoutImages>;
export type BankWithoutImagesOutput = z.output<typeof BankSchemaWithoutImages>;
