-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_couponId_fkey";

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "couponId" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'Pending';

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "coupons"("id") ON DELETE SET NULL ON UPDATE CASCADE;
