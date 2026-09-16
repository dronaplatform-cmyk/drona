/*
  Warnings:

  - You are about to drop the column `studentId` on the `Student` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Student_studentId_key";

-- AlterTable
ALTER TABLE "Student" DROP COLUMN "studentId";
