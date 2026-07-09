-- DropForeignKey
ALTER TABLE "shops" DROP CONSTRAINT IF EXISTS "shops_logoId_fkey";

-- DropTable
DROP TABLE IF EXISTS "shops";

-- Remove images tied to the old SHOP_LOGO entity type before shrinking the enum
DELETE FROM "Image" WHERE "entityType" = 'SHOP_LOGO';

-- AlterEnum
BEGIN;
CREATE TYPE "FileEntityType_new" AS ENUM ('AVATAR', 'BANK_LOGO', 'DOWNLOAD');
ALTER TABLE "Image" ALTER COLUMN "entityType" TYPE "FileEntityType_new" USING ("entityType"::text::"FileEntityType_new");
ALTER TABLE "Video" ALTER COLUMN "entityType" TYPE "FileEntityType_new" USING ("entityType"::text::"FileEntityType_new");
ALTER TYPE "FileEntityType" RENAME TO "FileEntityType_old";
ALTER TYPE "FileEntityType_new" RENAME TO "FileEntityType";
DROP TYPE "public"."FileEntityType_old";
COMMIT;

-- CreateTable
CREATE TABLE "banks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "logoId" TEXT NOT NULL,

    CONSTRAINT "banks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "banks_logoId_key" ON "banks"("logoId");

-- AddForeignKey
ALTER TABLE "banks" ADD CONSTRAINT "banks_logoId_fkey" FOREIGN KEY ("logoId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
