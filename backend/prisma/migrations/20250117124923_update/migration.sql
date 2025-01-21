-- DropIndex
DROP INDEX "payments_transactionId_orderId_idx";

-- CreateIndex
CREATE INDEX "payments_transactionId_orderId_id_idx" ON "payments"("transactionId", "orderId", "id");
