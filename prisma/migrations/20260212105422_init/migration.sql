-- AlterTable
ALTER TABLE "TutorProfile" ADD COLUMN     "adhaarId" TEXT,
ADD COLUMN     "classesTaught" TEXT,
ADD COLUMN     "experience" TEXT,
ADD COLUMN     "rating" DOUBLE PRECISION DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "image" TEXT,
ADD COLUMN     "profileImage" TEXT;
