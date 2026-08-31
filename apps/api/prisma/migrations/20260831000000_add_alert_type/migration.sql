-- Снимок вида уведомления на момент отправки. Существующие записи → IPHONE
-- (до этого изменения всегда показывался iOS-вид).
ALTER TABLE "alerts" ADD COLUMN "type" "ContinueTokenType" NOT NULL DEFAULT 'IPHONE';
