-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_paymentId_fkey";

-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "paymentId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
