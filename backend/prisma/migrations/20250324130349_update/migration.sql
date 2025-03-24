/*
  Warnings:

  - You are about to drop the column `searchDate` on the `searches` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "searches" DROP COLUMN "searchDate",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateTable
CREATE TABLE "WishListItem" (
    "productId" INTEGER NOT NULL,
    "customerId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WishListItem_pkey" PRIMARY KEY ("productId","customerId")
);

-- AddForeignKey
ALTER TABLE "WishListItem" ADD CONSTRAINT "WishListItem_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishListItem" ADD CONSTRAINT "WishListItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
