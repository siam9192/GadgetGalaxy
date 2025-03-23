/*
  Warnings:

  - The values [INACTIVE] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[productId,variantId]` on the table `cart_items` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('ACTIVE', 'PAUSED');
ALTER TABLE "search_keywords" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
COMMIT;

-- CreateIndex
CREATE UNIQUE INDEX "cart_items_productId_variantId_key" ON "cart_items"("productId", "variantId");
