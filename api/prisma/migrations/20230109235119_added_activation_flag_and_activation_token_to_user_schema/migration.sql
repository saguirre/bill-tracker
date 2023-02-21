-- AlterTable
ALTER TABLE "User" ADD COLUMN     "activated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "activationToken" TEXT;
