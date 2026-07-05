-- CreateTable
CREATE TABLE "landing_tokens" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "note" TEXT,
    "landingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "landing_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "landing_tokens_token_key" ON "landing_tokens"("token");

-- AddForeignKey
ALTER TABLE "landing_tokens" ADD CONSTRAINT "landing_tokens_landingId_fkey" FOREIGN KEY ("landingId") REFERENCES "landings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
