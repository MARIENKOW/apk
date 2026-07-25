-- CreateEnum
CREATE TYPE "ContinueTokenType" AS ENUM ('ANDROID', 'IPHONE');

-- AlterTable
ALTER TABLE "continue_tokens" ADD COLUMN "type" "ContinueTokenType" NOT NULL DEFAULT 'ANDROID';
