-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "FileEntityType" ADD VALUE 'LANDING_ICON';
ALTER TYPE "FileEntityType" ADD VALUE 'LANDING_LOGO';
ALTER TYPE "FileEntityType" ADD VALUE 'LANDING_BACKGROUND';

-- CreateTable
CREATE TABLE "landings" (
    "id" TEXT NOT NULL,
    "metaTitle" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "iconId" TEXT NOT NULL,
    "logoId" TEXT NOT NULL,
    "backgroundId" TEXT NOT NULL,

    CONSTRAINT "landings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "landings_iconId_key" ON "landings"("iconId");

-- CreateIndex
CREATE UNIQUE INDEX "landings_logoId_key" ON "landings"("logoId");

-- CreateIndex
CREATE UNIQUE INDEX "landings_backgroundId_key" ON "landings"("backgroundId");

-- AddForeignKey
ALTER TABLE "landings" ADD CONSTRAINT "landings_iconId_fkey" FOREIGN KEY ("iconId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "landings" ADD CONSTRAINT "landings_logoId_fkey" FOREIGN KEY ("logoId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "landings" ADD CONSTRAINT "landings_backgroundId_fkey" FOREIGN KEY ("backgroundId") REFERENCES "Image"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
