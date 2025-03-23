/*
  Warnings:

  - The primary key for the `shipping_charges` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `shipping_charges` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `shipping_information` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `shipping_information` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `exceptedDeliveryDate` on the `orders` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ShippingChargeStatus" AS ENUM ('ACTIVE', 'PAUSED');

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "exceptedDeliveryDate",
ADD COLUMN     "exceptedDeliveryDate" JSONB NOT NULL;

-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "customerId" INTEGER;

-- AlterTable
ALTER TABLE "shipping_charges" DROP CONSTRAINT "shipping_charges_pkey",
ADD COLUMN     "status" "ShippingChargeStatus" NOT NULL DEFAULT 'ACTIVE',
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "shipping_charges_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "shipping_information" DROP CONSTRAINT "shipping_information_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "shipping_information_pkey" PRIMARY KEY ("id");
