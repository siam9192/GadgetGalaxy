-- DropForeignKey
ALTER TABLE "PaymentRefundRequest" DROP CONSTRAINT "PaymentRefundRequest_id_fkey";

-- AddForeignKey
ALTER TABLE "PaymentRefundRequest" ADD CONSTRAINT "PaymentRefundRequest_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
