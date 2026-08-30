-- Объединение двух независимых доступов (tokens + continue_tokens) в один список.
-- Выживает `tokens`: добавляем type + isSecondPart, переносим все continue_tokens
-- внутрь (сохраняя id → алерты не теряются), затем дропаем continue_tokens.
--
-- Правила переноса:
--   continue_tokens.type = ANDROID → isSecondPart = true  (видно только во 2-й панели), note без изменений
--   continue_tokens.type = IPHONE  → isSecondPart = false (1-я панель), в note — пометка про старую 2-ю часть
--   существующие tokens (старая 1-я часть) → type = ANDROID (default), isSecondPart = false

-- 1. Новые колонки на tokens.
ALTER TABLE "tokens" ADD COLUMN "type" "ContinueTokenType" NOT NULL DEFAULT 'ANDROID';
ALTER TABLE "tokens" ADD COLUMN "isSecondPart" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX "tokens_isSecondPart_idx" ON "tokens"("isSecondPart");

-- 2. Переносим continue_tokens → tokens, сохраняя id (для сохранности FK алертов).
--    token уникален (uuid) — коллизий не ожидается; при невозможном совпадении миграция
--    упадёт явно, а не потеряет данные.
INSERT INTO "tokens" ("id", "token", "note", "type", "isSecondPart", "createdAt")
SELECT
    ct."id",
    ct."token",
    CASE
        WHEN ct."type" = 'IPHONE'
            THEN COALESCE(ct."note" || E'\n', '') || 'Перенесено со старой 2-й части сайта'
        ELSE ct."note"
    END,
    ct."type",
    (ct."type" = 'ANDROID'),
    ct."createdAt"
FROM "continue_tokens" ct;

-- 3. Перенацеливаем алерты с continue_tokens на tokens (id сохранены → значения валидны).
ALTER TABLE "alerts" DROP CONSTRAINT "alerts_continueTokenId_fkey";
ALTER TABLE "alerts" RENAME COLUMN "continueTokenId" TO "tokenId";
ALTER INDEX "alerts_continueTokenId_idx" RENAME TO "alerts_tokenId_idx";
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_tokenId_fkey"
    FOREIGN KEY ("tokenId") REFERENCES "tokens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- 4. Старой таблицы больше нет.
DROP TABLE "continue_tokens";
