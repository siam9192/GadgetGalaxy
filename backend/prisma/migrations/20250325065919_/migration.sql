/*
  Warnings:

  - You are about to drop the column `expireAt` on the `item_reservers` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ItemReserveStatus" AS ENUM ('RESERVED', 'RESTORED');

-- DropForeignKey
ALTER TABLE "item_reservers" DROP CONSTRAINT "item_reservers_orderId_fkey";

-- AlterTable
ALTER TABLE "item_reservers" DROP COLUMN "expireAt",
ADD COLUMN     "status" "ItemReserveStatus" NOT NULL DEFAULT 'RESERVED';

-- AddForeignKey
ALTER TABLE "item_reservers" ADD CONSTRAINT "item_reservers_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE CASCADE ON UPDATE CASCADE;
