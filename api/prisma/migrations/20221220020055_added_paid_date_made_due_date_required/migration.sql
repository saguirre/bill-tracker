/*
  Warnings:

  - Made the column `dueDate` on table `Bill` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Bill" ADD COLUMN     "paidDate" TIMESTAMP(3),
ALTER COLUMN "dueDate" SET NOT NULL;
