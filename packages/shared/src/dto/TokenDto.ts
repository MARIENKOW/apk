import type { ContinueTokenType } from "./ContinueTokenDto";

// Единый доступ ко всему сайту. isSecondPart — только про то, в какой
// админ-панели показывать запись (не про доступ): false → 1-я, true → 2-я.
export type TokenDto = {
    id: string;
    token: string;
    note: string | null;
    type: ContinueTokenType;
    isSecondPart: boolean;
    url: string;
    createdAt: string;
};

// Публичный контекст токена для страниц (обе части): только платформа.
export type TokenContextDto = {
    type: ContinueTokenType;
};
