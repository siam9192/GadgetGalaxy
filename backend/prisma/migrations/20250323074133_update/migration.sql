/*
  Warnings:

  - The primary key for the `discount_customer_ids` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `customerId` on the `discount_customer_ids` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "discount_customer_ids" DROP CONSTRAINT "discount_customer_ids_pkey",
DROP COLUMN "customerId",
ADD COLUMN     "customerId" INTEGER NOT NULL,
ADD CONSTRAINT "discount_customer_ids_pkey" PRIMARY KEY ("discountId", "customerId");
