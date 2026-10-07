-- Вид подачи алерта: SMS — пуш-баннер (прежнее поведение), ALERT — модалка с кнопкой.
CREATE TYPE "AlertKind" AS ENUM ('SMS', 'ALERT');

-- Существующие отправки → SMS (их реальный вид до этого изменения).
ALTER TABLE "alerts" ADD COLUMN "kind" "AlertKind" NOT NULL DEFAULT 'SMS';

-- Кастомная кнопка (только для kind=ALERT): название и ссылка. NULL — дефолт/без ссылки.
ALTER TABLE "alerts" ADD COLUMN "buttonLabel" TEXT;
ALTER TABLE "alerts" ADD COLUMN "buttonUrl" TEXT;
