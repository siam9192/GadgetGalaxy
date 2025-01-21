-- CreateIndex
CREATE INDEX "payments_transactionId_orderId_idx" ON "payments"("transactionId", "orderId");
