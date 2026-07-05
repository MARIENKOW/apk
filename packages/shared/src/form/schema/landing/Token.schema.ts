import { InvitationNote } from "../../fields";
import z from "zod";

export const TokenNoteSchema = z.object({
    note: InvitationNote,
});

export type CreateTokenDtoInput = z.input<typeof TokenNoteSchema>;
export type CreateTokenDtoOutput = z.infer<typeof TokenNoteSchema>;
export type UpdateNoteTokenDtoInput = CreateTokenDtoInput;
export type UpdateNoteTokenDtoOutput = CreateTokenDtoOutput;
