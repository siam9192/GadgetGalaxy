-- AlterEnum
ALTER TYPE "ProductStatus" ADD VALUE 'DELETED';

-- DropForeignKey
ALTER TABLE "variant_attributes" DROP CONSTRAINT "variant_attributes_variantId_fkey";

-- AddForeignKey
ALTER TABLE "variant_attributes" ADD CONSTRAINT "variant_attributes_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "variants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
