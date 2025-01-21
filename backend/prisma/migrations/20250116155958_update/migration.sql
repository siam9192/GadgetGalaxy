/*
  Warnings:

  - You are about to drop the column `couponCode` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "couponCode",
ADD COLUMN     "discountCode" TEXT;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_discountCode_fkey" FOREIGN KEY ("discountCode") REFERENCES "coupons"("code") ON DELETE SET NULL ON UPDATE CASCADE;
