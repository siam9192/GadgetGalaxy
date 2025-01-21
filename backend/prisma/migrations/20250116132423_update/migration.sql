/*
  Warnings:

  - The primary key for the `shipping_information` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[orderId]` on the table `shipping_information` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `shipping_information` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "order_items" ALTER COLUMN "attributes" DROP NOT NULL;

-- AlterTable
ALTER TABLE "shipping_information" DROP CONSTRAINT "shipping_information_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "shipping_information_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "shipping_charges" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "estimatedDeliveryTime" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "shipping_charges_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "shipping_information_orderId_key" ON "shipping_information"("orderId");
