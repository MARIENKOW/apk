import { InvitationNote } from "../../fields";
import { ContinueTokenTypeEnum } from "../continue-token/ContinueToken.schema";
import z from "zod";

// Заметка (создание/редактирование note).
export const TokenNoteSchema = z.object({
    note: InvitationNote,
});

// Смена платформы (android/iphone).
export const TokenTypeSchema = z.object({
    type: ContinueTokenTypeEnum,
});

// Создание доступа. isSecondPart решает, в какой панели он будет виден:
// 1-я панель шлёт false, 2-я — всегда true (+ type=android).
export const TokenCreateSchema = z.object({
    note: InvitationNote,
    type: ContinueTokenTypeEnum.default("android"),
    isSecondPart: z.boolean().default(false),
});

export type CreateTokenDtoInput = z.input<typeof TokenCreateSchema>;
export type CreateTokenDtoOutput = z.infer<typeof TokenCreateSchema>;

export type UpdateNoteTokenDtoInput = z.input<typeof TokenNoteSchema>;
export type UpdateNoteTokenDtoOutput = z.infer<typeof TokenNoteSchema>;

export type UpdateTypeTokenDtoInput = z.input<typeof TokenTypeSchema>;
export type UpdateTypeTokenDtoOutput = z.infer<typeof TokenTypeSchema>;
