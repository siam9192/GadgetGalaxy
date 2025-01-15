-- DropForeignKey
ALTER TABLE "variants" DROP CONSTRAINT "variants_productId_fkey";

-- AddForeignKey
ALTER TABLE "variants" ADD CONSTRAINT "variants_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
