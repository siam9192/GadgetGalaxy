/*
  Warnings:

  - You are about to drop the column `deliveryTime` on the `shipping_charges` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "exceptedDeliveryDate" SET DEFAULT '2025/03/19-2025/03/26',
ALTER COLUMN "exceptedDeliveryDate" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "shipping_charges" DROP COLUMN "deliveryTime",
ADD COLUMN     "deliveryHours" TEXT NOT NULL DEFAULT '48-72';
