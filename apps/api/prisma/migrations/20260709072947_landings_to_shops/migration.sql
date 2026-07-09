-- DropForeignKey
ALTER TABLE "landings" DROP CONSTRAINT IF EXISTS "landings_backgroundId_fkey";

-- DropForeignKey
ALTER TABLE "landings" DROP CONSTRAINT IF EXISTS "landings_iconId_fkey";

-- DropForeignKey
ALTER TABLE "landings" DROP CONSTRAINT IF EXISTS "landings_logoId_fkey";

-- DropTable
DROP TABLE IF EXISTS "landings";

-- Remove images tied to the old landing entity types before shrinking the enum
DELETE FROM "Image" WHERE "entityType" IN ('LANDING_ICON', 'LANDING_LOGO', 'LANDING_BACKGROUND');

-- AlterEnum
BEGIN;
CREATE TYPE "FileEntityType_new" AS ENUM ('AVATAR', 'SHOP_LOGO', 'DOWNLOAD');
ALTER TABLE "Image" ALTER COLUMN "entityType" TYPE "FileEntityType_new" USING ("entityType"::text::"FileEntityType_new");
ALTER TABLE "Video" ALTER COLUMN "entityType" TYPE "FileEntityType_new" USING ("entityType"::text::"FileEntityType_new");
ALTER TYPE "FileEntityType" RENAME TO "FileEntityType_old";
ALTER TYPE "FileEntityType_new" RENAME TO "FileEntityType";
DROP TYPE "public"."FileEntityType_old";
COMMIT;

-- CreateTable
CREATE TABLE "shops" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "logoId" TEXT NOT NULL,

    CONSTRAINT "shops_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shops_logoId_key" ON "shops"("logoId");

-- AddForeignKey
ALTER TABLE "shops" ADD CONSTRAINT "shops_logoId_fkey" FOREIGN KEY ("logoId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
