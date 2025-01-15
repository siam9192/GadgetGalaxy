-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('Image', 'Video', 'Audio', 'Pdf');

-- CreateEnum
CREATE TYPE "MediaHoistingProvider" AS ENUM ('ImgBB', 'Cloudinary');

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "isFeatured" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Event" (
    "name" TEXT NOT NULL,
    "description" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" "Status" NOT NULL
);

-- CreateTable
CREATE TABLE "EventBanner" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "EventBanner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "media" (
    "id" TEXT NOT NULL,
    "src" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "hoistingProvider" "MediaHoistingProvider" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);
