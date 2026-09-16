/*
  Warnings:

  - Added the required column `adminUsername` to the `AdminActivityLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AdminActivityLog" ADD COLUMN     "adminUsername" TEXT NOT NULL;
