-- CreateTable
CREATE TABLE "app_parcel" (
    "id" TEXT NOT NULL,
    "parcelDate" TEXT NOT NULL DEFAULT '',
    "parcelNumber" TEXT NOT NULL DEFAULT '',
    "sender" TEXT NOT NULL DEFAULT '',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "app_parcel_pkey" PRIMARY KEY ("id")
);
