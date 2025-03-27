-- CreateEnum
CREATE TYPE "PaymentRefundStatus" AS ENUM ('PENDING', 'COMPLETED', 'REJECTED', 'EXPIRED');

-- CreateTable
CREATE TABLE "PaymentRefundRequest" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "status" "PaymentRefundStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentRefundRequest_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PaymentRefundRequest" ADD CONSTRAINT "PaymentRefundRequest_id_fkey" FOREIGN KEY ("id") REFERENCES "payments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
