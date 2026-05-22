-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MEMBER', 'MEDIA', 'PASTOR', 'SECRETARY', 'ADMIN');

-- CreateEnum
CREATE TYPE "ServiceState" AS ENUM ('OFFLINE', 'PREPARING', 'LIVE', 'PAUSED', 'ENDED');

-- CreateEnum
CREATE TYPE "SermonStatus" AS ENUM ('DRAFT', 'READY', 'DELIVERED');

-- CreateEnum
CREATE TYPE "AnnouncementCategory" AS ENUM ('GENERAL', 'EVENT', 'EMERGENCY', 'PRAYER', 'OFFERING');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" "Role" NOT NULL DEFAULT 'MEMBER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LiveService" (
    "id" TEXT NOT NULL,
    "currentScripture" TEXT,
    "sermonTitle" TEXT,
    "state" "ServiceState" NOT NULL DEFAULT 'OFFLINE',
    "startedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "sermonId" TEXT,

    CONSTRAINT "LiveService_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sermon" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "SermonStatus" NOT NULL DEFAULT 'DRAFT',
    "scriptureList" JSONB,
    "queue" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sermon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Announcement" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "category" "AnnouncementCategory" NOT NULL DEFAULT 'GENERAL',
    "isLive" BOOLEAN NOT NULL DEFAULT false,
    "scheduledAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Announcement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "LiveService_sermonId_key" ON "LiveService"("sermonId");

-- AddForeignKey
ALTER TABLE "LiveService" ADD CONSTRAINT "LiveService_sermonId_fkey" FOREIGN KEY ("sermonId") REFERENCES "Sermon"("id") ON DELETE SET NULL ON UPDATE CASCADE;
