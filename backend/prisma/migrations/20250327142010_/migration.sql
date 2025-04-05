/*
  Warnings:

  - A unique constraint covering the columns `[paymentId]` on the table `PaymentRefundRequest` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PaymentRefundRequest_paymentId_key" ON "PaymentRefundRequest"("paymentId");
