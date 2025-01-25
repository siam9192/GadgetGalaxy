-- DropIndex
DROP INDEX "coupons_description_key";

-- AlterTable
ALTER TABLE "coupons" ALTER COLUMN "status" SET DEFAULT 'Active';
