-- CreateEnum
CREATE TYPE "GivingType" AS ENUM ('TITHE', 'OFFERING', 'THANKSGIVING', 'BUILDING_FUND', 'MISSION_SUPPORT', 'SPECIAL_SEED');

-- CreateEnum
CREATE TYPE "GivingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'REJECTED');

-- CreateTable
CREATE TABLE "Giving" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "category" "GivingType" NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "reference" TEXT,
    "note" TEXT,
    "service" TEXT NOT NULL,
    "status" "GivingStatus" NOT NULL DEFAULT 'CONFIRMED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Giving_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Giving" ADD CONSTRAINT "Giving_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
