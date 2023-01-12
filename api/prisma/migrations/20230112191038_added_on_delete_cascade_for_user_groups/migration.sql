-- DropForeignKey
ALTER TABLE "UserGroups" DROP CONSTRAINT "UserGroups_groupId_fkey";

-- DropForeignKey
ALTER TABLE "UserGroups" DROP CONSTRAINT "UserGroups_userId_fkey";

-- AddForeignKey
ALTER TABLE "UserGroups" ADD CONSTRAINT "UserGroups_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserGroups" ADD CONSTRAINT "UserGroups_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
