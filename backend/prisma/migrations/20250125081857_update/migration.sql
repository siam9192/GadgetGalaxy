-- DropForeignKey
ALTER TABLE "discount_category_ids" DROP CONSTRAINT "discount_category_ids_discountId_fkey";

-- DropForeignKey
ALTER TABLE "discount_customer_ids" DROP CONSTRAINT "discount_customer_ids_discountId_fkey";

-- AddForeignKey
ALTER TABLE "discount_customer_ids" ADD CONSTRAINT "discount_customer_ids_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "coupons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discount_category_ids" ADD CONSTRAINT "discount_category_ids_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "coupons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
