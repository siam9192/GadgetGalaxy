/*
  Warnings:

  - You are about to drop the column `json` on the `payments` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "OrderPaymentStatus" AS ENUM ('Paid', 'Unpaid');

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "paymentStatus" "OrderPaymentStatus" NOT NULL DEFAULT 'Unpaid';

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "json",
ADD COLUMN     "gatewayGatewayData" JSONB;
