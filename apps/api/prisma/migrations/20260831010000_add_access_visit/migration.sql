-- Визиты доступа: глобальный лог «кто заходил» (устройство/гео/время/онлайн).
-- Плюс снимок User-Agent у показов алерта — для устройства в раскрытии показов.

-- AlterTable: UA у показа алерта
ALTER TABLE "alert_views" ADD COLUMN "userAgent" TEXT;

-- CreateTable
CREATE TABLE "access_visits" (
    "id" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "userAgent" TEXT,
    "connectedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "disconnectedAt" TIMESTAMP(3),
    "tokenId" TEXT NOT NULL,

    CONSTRAINT "access_visits_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "access_visits_tokenId_idx" ON "access_visits"("tokenId");

-- CreateIndex
CREATE INDEX "access_visits_tokenId_connectedAt_idx" ON "access_visits"("tokenId", "connectedAt");

-- AddForeignKey
ALTER TABLE "access_visits" ADD CONSTRAINT "access_visits_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "tokens"("id") ON DELETE CASCADE ON UPDATE CASCADE;
