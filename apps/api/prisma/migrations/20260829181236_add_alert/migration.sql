-- CreateTable
CREATE TABLE "alerts" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "continueTokenId" TEXT NOT NULL,

    CONSTRAINT "alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alert_views" (
    "id" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "shownAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "alertId" TEXT NOT NULL,

    CONSTRAINT "alert_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "alerts_continueTokenId_idx" ON "alerts"("continueTokenId");

-- CreateIndex
CREATE INDEX "alerts_active_idx" ON "alerts"("active");

-- CreateIndex
CREATE INDEX "alert_views_alertId_idx" ON "alert_views"("alertId");

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_continueTokenId_fkey" FOREIGN KEY ("continueTokenId") REFERENCES "continue_tokens"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alert_views" ADD CONSTRAINT "alert_views_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "alerts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
