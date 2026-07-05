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
    LANDING_LOGO_HEIGHT_DEFAULT,
    LANDING_BTN_NAME_MAX_LENGTH,
    LANDING_BTN_NAME_MIN_LENGTH,
    LANDING_LOGO_HEIGHT_MAX,
    LANDING_LOGO_HEIGHT_MIN,
    LANDING_META_TITLE_MAX_LENGTH,
    LANDING_META_TITLE_MIN_LENGTH,
    LANDING_PHONE_MAX_LENGTH,
    LANDING_PHONE_MIN_LENGTH,
    LANDING_SUBTITLE_MAX_LENGTH,
    LANDING_SUBTITLE_MIN_LENGTH,
    LANDING_TITLE_MAX_LENGTH,
    LANDING_TITLE_MIN_LENGTH,
    PASSWORD_MAX_LENGTH,
    PASSWORD_MIN_LENGTH,
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

export const LandingTitle = z
    .string()
    .nonempty(getMessageKey("form.required"))
    .trim()
    .normalize()
    .max(LANDING_TITLE_MAX_LENGTH, getMessageKey("form.landing.title.max"));

export const LandingPhone = z
    .string()
    .nonempty(getMessageKey("form.required"))
    .trim()
    .max(LANDING_PHONE_MAX_LENGTH, getMessageKey("form.landing.phone.max"));

export const LandingColor = z
    .string()
    .nonempty(getMessageKey("form.required"))
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, getMessageKey("form.landing.color.invalid"));

export const LandingBtnName = z
    .string()
    .nonempty(getMessageKey("form.required"))
    .trim()
    .normalize()
    .max(
        LANDING_BTN_NAME_MAX_LENGTH,
        getMessageKey("form.landing.btnName.max"),
    );

export const LandingLogoHeight = z.coerce
    .number()
    .int()
    .min(LANDING_LOGO_HEIGHT_MIN, {
        message: getMessageKey("form.landing.logoHeight.min"),
    })
    .max(LANDING_LOGO_HEIGHT_MAX, {
        message: getMessageKey("form.landing.logoHeight.max"),
    })
    .catch(LANDING_LOGO_HEIGHT_DEFAULT);
