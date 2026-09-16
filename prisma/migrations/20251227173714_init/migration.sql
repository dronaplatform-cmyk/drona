-- AlterEnum
ALTER TYPE "ClassStatus" ADD VALUE 'IN_PROGRESS';

-- AlterTable
ALTER TABLE "Class" ADD COLUMN     "verificationDate" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Resource" ADD COLUMN     "classId" TEXT,
ADD COLUMN     "mimeType" TEXT,
ADD COLUMN     "size" INTEGER;

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_classId_fkey" FOREIGN KEY ("classId") REFERENCES "Class"("id") ON DELETE SET NULL ON UPDATE CASCADE;
