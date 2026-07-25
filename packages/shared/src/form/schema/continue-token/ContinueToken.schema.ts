import { InvitationNote } from "../../fields";
import z from "zod";

export const ContinueTokenNoteSchema = z.object({
    note: InvitationNote,
});

export type CreateContinueTokenDtoInput = z.input<
    typeof ContinueTokenNoteSchema
>;
export type CreateContinueTokenDtoOutput = z.infer<
    typeof ContinueTokenNoteSchema
>;
export type UpdateNoteContinueTokenDtoInput = CreateContinueTokenDtoInput;
export type UpdateNoteContinueTokenDtoOutput = CreateContinueTokenDtoOutput;
