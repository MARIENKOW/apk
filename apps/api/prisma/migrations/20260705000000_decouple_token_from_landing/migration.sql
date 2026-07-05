-- DropForeignKey
ALTER TABLE "landing_tokens" DROP CONSTRAINT "landing_tokens_landingId_fkey";

-- DropIndex
DROP INDEX "landing_tokens_token_key";

-- RenameTable
ALTER TABLE "landing_tokens" RENAME TO "tokens";

-- DropColumn
ALTER TABLE "tokens" DROP COLUMN "landingId";

-- RenamePrimaryKey
ALTER TABLE "tokens" RENAME CONSTRAINT "landing_tokens_pkey" TO "tokens_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "tokens_token_key" ON "tokens"("token");
