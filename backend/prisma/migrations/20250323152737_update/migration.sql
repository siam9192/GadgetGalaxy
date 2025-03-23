/*
  Warnings:

  - You are about to drop the column `expiredAt` on the `item_reservers` table. All the data in the column will be lost.
  - You are about to drop the column `orderId` on the `payments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[paymentId]` on the table `orders` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expireAt` to the `item_reservers` table without a default value. This is not possible if the table is not empty.
  - Made the column `paymentId` on table `orders` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_orderId_fkey";

-- DropIndex
DROP INDEX "payments_orderId_key";

-- DropIndex
DROP INDEX "payments_transactionId_orderId_id_idx";

-- AlterTable
ALTER TABLE "item_reservers" DROP COLUMN "expiredAt",
ADD COLUMN     "expireAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "paymentId" SET NOT NULL;

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "orderId";

-- CreateIndex
CREATE UNIQUE INDEX "orders_paymentId_key" ON "orders"("paymentId");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
