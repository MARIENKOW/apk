-- AlterTable
ALTER TABLE "app_data" ADD COLUMN     "authorization" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "confirmation" TEXT NOT NULL DEFAULT '';
