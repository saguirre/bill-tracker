/*
  Warnings:

  - You are about to drop the column `userGroupId` on the `Bill` table. All the data in the column will be lost.
  - You are about to drop the column `userGroupId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `UserGroup` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Bill" DROP CONSTRAINT "Bill_userGroupId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_groupId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_userGroupId_fkey";

-- AlterTable
ALTER TABLE "Bill" DROP COLUMN "userGroupId",
ADD COLUMN     "groupId" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "userGroupId",
ADD COLUMN     "groupId" INTEGER;

-- DropTable
DROP TABLE "UserGroup";

-- CreateTable
CREATE TABLE "Group" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE SET NULL ON UPDATE CASCADE;
