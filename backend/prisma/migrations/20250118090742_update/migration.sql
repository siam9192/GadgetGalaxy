-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "exceptedDeliveryDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "shipping_charges" ADD COLUMN     "deliveryTime" TEXT NOT NULL DEFAULT '1-5 days';
