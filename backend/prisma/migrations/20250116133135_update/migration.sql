/*
  Warnings:

  - You are about to drop the column `estimatedDeliveryTime` on the `shipping_charges` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "shipping_charges" DROP COLUMN "estimatedDeliveryTime",
ALTER COLUMN "description" DROP NOT NULL;
