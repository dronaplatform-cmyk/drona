-- AlterTable
ALTER TABLE "Student" ADD COLUMN "username" TEXT;

-- Populate existing rows with a unique value based on ID
UPDATE "Student" SET "username" = 'student_' || "id" WHERE "username" IS NULL;

-- Make it NOT NULL
ALTER TABLE "Student" ALTER COLUMN "username" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Student_username_key" ON "Student"("username");
