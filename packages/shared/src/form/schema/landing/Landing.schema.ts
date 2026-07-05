import { z } from "zod";
import { getMessageKey } from "../../../i18n";
import {
    LANDING_IMAGE_CONFIG,
    LANDING_META_TITLE_MAX_LENGTH,
    LANDING_SUBTITLE_MAX_LENGTH,
} from "../../constants";
import {
    LandingBtnName,
    LandingColor,
    LandingLogoHeight,
    LandingPhone,
    LandingTitle,
} from "../../fields";

const LandingImageFieldBase = z
    .union([z.instanceof(File), z.string()])
    .nullable()
    .refine(
        (f) =>
            !(f instanceof File) ||
            LANDING_IMAGE_CONFIG.allowedMimeTypes.includes(f.type),
        getMessageKey("form.file.unsupportedType"),
    )
    .refine(
        (f) =>
            !(f instanceof File) ||
            f.size <= LANDING_IMAGE_CONFIG.maxFileSizeBytes,
        getMessageKey("form.file.landingImage.tooLarge"),
    );

const LandingImageField = LandingImageFieldBase.refine(
    (f) => f !== null,
    getMessageKey("form.required"),
);

const LandingBaseSchema = z.object({
    metaTitle: z
        .string()
        .trim()
        .normalize()
        .refine(
            (v) => !v || v.length <= LANDING_META_TITLE_MAX_LENGTH,
            getMessageKey("form.landing.metaTitle.max"),
        ),
    color: LandingColor,
    phone: LandingPhone,
    title: LandingTitle,
    subtitle: z
        .string()
        .trim()
        .normalize()
        .refine(
            (v) => !v || v.length <= LANDING_SUBTITLE_MAX_LENGTH,
            getMessageKey("form.landing.subtitle.max"),
        ),
    logoHeight: LandingLogoHeight,
    btnName: LandingBtnName,
    icon: LandingImageFieldBase.optional(),
});

export const LandingSchema = LandingBaseSchema.extend({
    logo: LandingImageField,
    background: LandingImageField,
});

export const LandingSchemaWithoutImages = LandingBaseSchema;

export type LandingInput = z.input<typeof LandingSchema>;
export type LandingOutput = z.output<typeof LandingSchema>;

export type LandingWithoutImagesInput = z.input<
    typeof LandingSchemaWithoutImages
>;
export type LandingWithoutImagesOutput = z.output<
    typeof LandingSchemaWithoutImages
>;
