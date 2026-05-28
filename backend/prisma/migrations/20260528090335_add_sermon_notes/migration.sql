-- CreateTable
CREATE TABLE "SermonNote" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "sermonId" TEXT,
    "title" TEXT NOT NULL,
    "scripture" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SermonNote_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SermonNote" ADD CONSTRAINT "SermonNote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
