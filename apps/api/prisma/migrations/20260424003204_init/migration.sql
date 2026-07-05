-- CreateEnum
CREATE TYPE "RoleAdmin" AS ENUM ('ADMIN', 'SUPERADMIN');

-- CreateEnum
CREATE TYPE "StatusAdmin" AS ENUM ('ACTIVE', 'BLOCKED');

-- CreateEnum
CREATE TYPE "ChangePasswordCodeStatus" AS ENUM ('PENDING', 'BLOCKED', 'SUCCESS');

-- CreateEnum
CREATE TYPE "FileEntityType" AS ENUM ('AVATAR');

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT,
    "note" TEXT,
    "theme" TEXT,
    "locale" TEXT,
    "status" "StatusAdmin" NOT NULL DEFAULT 'ACTIVE',
    "role" "RoleAdmin" NOT NULL DEFAULT 'ADMIN',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "passwordChangedAt" TIMESTAMP(3),
    "lastSeenAt" TIMESTAMP(3),
    "lastLoginAt" TIMESTAMP(3),
    "avatarId" TEXT,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_invitations" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "note" TEXT,
    "token" TEXT NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_invitations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resetPasswordTokenAdmin" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resetPasswordTokenAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SessionAdmin" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "userAgent" TEXT,
    "refreshTokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "previousRefreshTokenHash" TEXT,
    "previousTokenExpiresAt" TIMESTAMP(3),
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastUsedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SessionAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "changePasswordCodeAdmin" (
    "adminId" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "newPasswordHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "resendCount" INTEGER NOT NULL DEFAULT 0,
    "lastResendAt" TIMESTAMP(3),
    "blockedAt" TIMESTAMP(3),
    "status" "ChangePasswordCodeStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "changePasswordCodeAdmin_pkey" PRIMARY KEY ("adminId")
);

-- CreateTable
CREATE TABLE "Image" (
    "id" TEXT NOT NULL,
    "entityType" "FileEntityType" NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "path" TEXT,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL,
    "entityType" "FileEntityType" NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "path" TEXT,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "duration" DOUBLE PRECISION NOT NULL,
    "size" INTEGER NOT NULL,
    "imageId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Video_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admins_avatarId_key" ON "admins"("avatarId");

-- CreateIndex
CREATE UNIQUE INDEX "admin_invitations_email_key" ON "admin_invitations"("email");

-- CreateIndex
CREATE UNIQUE INDEX "admin_invitations_token_key" ON "admin_invitations"("token");

-- CreateIndex
CREATE INDEX "admin_invitations_email_idx" ON "admin_invitations"("email");

-- CreateIndex
CREATE UNIQUE INDEX "resetPasswordTokenAdmin_adminId_key" ON "resetPasswordTokenAdmin"("adminId");

-- CreateIndex
CREATE INDEX "resetPasswordTokenAdmin_adminId_idx" ON "resetPasswordTokenAdmin"("adminId");

-- CreateIndex
CREATE INDEX "resetPasswordTokenAdmin_expiresAt_idx" ON "resetPasswordTokenAdmin"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "SessionAdmin_refreshTokenHash_key" ON "SessionAdmin"("refreshTokenHash");

-- CreateIndex
CREATE UNIQUE INDEX "SessionAdmin_previousRefreshTokenHash_key" ON "SessionAdmin"("previousRefreshTokenHash");

-- CreateIndex
CREATE INDEX "SessionAdmin_adminId_idx" ON "SessionAdmin"("adminId");

-- CreateIndex
CREATE INDEX "SessionAdmin_refreshTokenHash_idx" ON "SessionAdmin"("refreshTokenHash");

-- CreateIndex
CREATE INDEX "Image_entityType_idx" ON "Image"("entityType");

-- CreateIndex
CREATE UNIQUE INDEX "Video_imageId_key" ON "Video"("imageId");

-- CreateIndex
CREATE INDEX "Video_entityType_idx" ON "Video"("entityType");

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_avatarId_fkey" FOREIGN KEY ("avatarId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "resetPasswordTokenAdmin" ADD CONSTRAINT "resetPasswordTokenAdmin_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SessionAdmin" ADD CONSTRAINT "SessionAdmin_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "changePasswordCodeAdmin" ADD CONSTRAINT "changePasswordCodeAdmin_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE SET NULL ON UPDATE CASCADE;
