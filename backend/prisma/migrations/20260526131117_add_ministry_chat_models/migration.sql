-- CreateTable
CREATE TABLE "MinistryGroup" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "accent" TEXT NOT NULL DEFAULT '#1B3A7A',
    "imageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MinistryGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MinistryMember" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MinistryMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MinistryMessage" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MinistryMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MinistryGroup_name_key" ON "MinistryGroup"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MinistryMember_groupId_userId_key" ON "MinistryMember"("groupId", "userId");

-- AddForeignKey
ALTER TABLE "MinistryMember" ADD CONSTRAINT "MinistryMember_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "MinistryGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MinistryMember" ADD CONSTRAINT "MinistryMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MinistryMessage" ADD CONSTRAINT "MinistryMessage_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "MinistryGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MinistryMessage" ADD CONSTRAINT "MinistryMessage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
