export type ContinueTokenType = "android" | "iphone";

// Публичный контекст токена для страниц (continue): только платформа.
export type ContinueTokenContextDto = {
    type: ContinueTokenType;
};

export type ContinueTokenDto = {
    id: string;
    token: string;
    note: string | null;
    type: ContinueTokenType;
    url: string;
    createdAt: string;
};
