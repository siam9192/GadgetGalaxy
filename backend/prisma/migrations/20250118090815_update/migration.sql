-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "exceptedDeliveryDate" DROP DEFAULT;

-- AlterTable
ALTER TABLE "shipping_charges" ALTER COLUMN "deliveryTime" DROP DEFAULT;
