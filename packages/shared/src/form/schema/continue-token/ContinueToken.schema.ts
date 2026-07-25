import { InvitationNote } from "../../fields";
import z from "zod";

export const ContinueTokenTypeEnum = z.enum(["android", "iphone"]);

export const ContinueTokenNoteSchema = z.object({
    note: InvitationNote,
});

export const ContinueTokenTypeSchema = z.object({
    type: ContinueTokenTypeEnum,
});

export const ContinueTokenCreateSchema = z.object({
    note: InvitationNote,
    type: ContinueTokenTypeEnum.default("android"),
});

export type CreateContinueTokenDtoInput = z.input<
    typeof ContinueTokenCreateSchema
>;
export type CreateContinueTokenDtoOutput = z.infer<
    typeof ContinueTokenCreateSchema
>;

export type UpdateNoteContinueTokenDtoInput = z.input<
    typeof ContinueTokenNoteSchema
>;
export type UpdateNoteContinueTokenDtoOutput = z.infer<
    typeof ContinueTokenNoteSchema
>;

export type UpdateTypeContinueTokenDtoInput = z.input<
    typeof ContinueTokenTypeSchema
>;
export type UpdateTypeContinueTokenDtoOutput = z.infer<
    typeof ContinueTokenTypeSchema
>;
