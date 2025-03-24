-- CreateEnum
CREATE TYPE "ProductReviewStatus" AS ENUM ('VISIBLE', 'HIDDEN');

-- AlterTable
ALTER TABLE "product_reviews" ADD COLUMN     "status" "ProductReviewStatus" NOT NULL DEFAULT 'VISIBLE';
