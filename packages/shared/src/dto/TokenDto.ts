import type { ContinueTokenType } from "./ContinueTokenDto";

// Единый доступ ко всему сайту. isSecondPart — только про то, в какой
// админ-панели показывать запись (не про доступ): false → 1-я, true → 2-я.
export type TokenDto = {
    id: string;
    token: string;
    note: string | null;
    type: ContinueTokenType;
    isSecondPart: boolean;
    // Есть ли сейчас живое SSE-подключение посетителя (снимок на момент запроса).
    online: boolean;
    url: string;
    createdAt: string;
};

// Публичный контекст токена для страниц (обе части): только платформа.
export type TokenContextDto = {
    type: ContinueTokenType;
};
