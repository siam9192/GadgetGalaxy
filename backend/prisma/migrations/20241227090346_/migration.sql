/*
  Warnings:

  - The values [Completed] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [Vendor] on the enum `UserRole` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `cart_items` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `code` on the `coupons` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `subTotal` on the `order_items` table. All the data in the column will be lost.
  - You are about to drop the column `couponId` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `finalAmount` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `shippingFee` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `created_at` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `shopId` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `googleId` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `provider` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `admin` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `customers_address` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `followers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `parent_categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `shipping_addresses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `shops` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `vendors` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug]` on the table `categories` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[couponCode]` on the table `coupons` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `products` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `cart_items` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `slug` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `couponCode` to the `coupons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `coupons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `attributes` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imageUrl` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productName` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `variantId` to the `order_items` table without a default value. This is not possible if the table is not empty.
  - Added the required column `grossAmount` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `netAmount` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shippingAmount` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `json` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `payments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `brandId` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('OrderStatus', 'Promotion', 'WishlistUpdate', 'System', 'Alert');

-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('Google', 'Facebook', 'EmailPassword');

-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('Active', 'Blocked', 'Suspended', 'Deleted');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Active', 'InActive');

-- CreateEnum
CREATE TYPE "DiscountStatus" AS ENUM ('Active', 'InActive', 'Disabled');

-- CreateEnum
CREATE TYPE "TrackingStatus" AS ENUM ('Shipped', 'OutForDelivery', 'Delivered', 'Failed');

-- CreateEnum
CREATE TYPE "Browser" AS ENUM ('Chrome', 'Firefox', 'MicrosoftEdge', 'OperaMini', 'Unknown');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "OrderStatus" ADD VALUE 'Placed';
ALTER TYPE "OrderStatus" ADD VALUE 'OutForDelivery';
ALTER TYPE "OrderStatus" ADD VALUE 'Returned';

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentStatus_new" AS ENUM ('Pending', 'Successful', 'Failed', 'Expired', 'Canceled');
ALTER TABLE "payments" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "payments" ALTER COLUMN "status" TYPE "PaymentStatus_new" USING ("status"::text::"PaymentStatus_new");
ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "PaymentStatus_old";
ALTER TABLE "payments" ALTER COLUMN "status" SET DEFAULT 'Pending';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "UserRole_new" AS ENUM ('SuperAdmin', 'Admin', 'Customer');
ALTER TABLE "users" ALTER COLUMN "role" TYPE "UserRole_new" USING ("role"::text::"UserRole_new");
ALTER TYPE "UserRole" RENAME TO "UserRole_old";
ALTER TYPE "UserRole_new" RENAME TO "UserRole";
DROP TYPE "UserRole_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "admin" DROP CONSTRAINT "admin_userId_fkey";

-- DropForeignKey
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_productId_fkey";

-- DropForeignKey
ALTER TABLE "categories" DROP CONSTRAINT "categories_parentId_fkey";

-- DropForeignKey
ALTER TABLE "customers_address" DROP CONSTRAINT "customers_address_customerId_fkey";

-- DropForeignKey
ALTER TABLE "followers" DROP CONSTRAINT "followers_customerId_fkey";

-- DropForeignKey
ALTER TABLE "followers" DROP CONSTRAINT "followers_shopId_fkey";

-- DropForeignKey
ALTER TABLE "order_items" DROP CONSTRAINT "order_items_productId_fkey";

-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_couponId_fkey";

-- DropForeignKey
ALTER TABLE "products" DROP CONSTRAINT "products_shopId_fkey";

-- DropForeignKey
ALTER TABLE "shipping_addresses" DROP CONSTRAINT "shipping_addresses_orderId_fkey";

-- DropForeignKey
ALTER TABLE "shops" DROP CONSTRAINT "shops_vendorId_fkey";

-- DropForeignKey
ALTER TABLE "vendors" DROP CONSTRAINT "vendors_userId_fkey";

-- DropIndex
DROP INDEX "coupons_code_key";

-- AlterTable
ALTER TABLE "cart_items" DROP CONSTRAINT "cart_items_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "variantId" TEXT,
ALTER COLUMN "productId" DROP NOT NULL,
ADD CONSTRAINT "cart_items_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "description" VARCHAR(1000),
ADD COLUMN     "image_url" TEXT,
ADD COLUMN     "slug" TEXT NOT NULL,
ALTER COLUMN "parentId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "coupons" DROP COLUMN "code",
ADD COLUMN     "couponCode" VARCHAR(20) NOT NULL,
ADD COLUMN     "status" "DiscountStatus" NOT NULL;

-- AlterTable
ALTER TABLE "customers" DROP COLUMN "firstName",
DROP COLUMN "lastName",
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "fullName" VARCHAR(30) NOT NULL,
ADD COLUMN     "phoneNumber" TEXT;

-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "subTotal",
ADD COLUMN     "attributes" JSONB NOT NULL,
ADD COLUMN     "imageUrl" TEXT NOT NULL,
ADD COLUMN     "productName" TEXT NOT NULL,
ADD COLUMN     "totalAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "variantId" TEXT NOT NULL,
ALTER COLUMN "productId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "couponId",
DROP COLUMN "finalAmount",
DROP COLUMN "shippingFee",
ADD COLUMN     "couponCode" TEXT,
ADD COLUMN     "grossAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "netAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "shippingAmount" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "created_at",
DROP COLUMN "customerId",
DROP COLUMN "updated_at",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "json" JSONB NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "shopId",
ADD COLUMN     "brandId" TEXT NOT NULL,
ADD COLUMN     "slug" TEXT NOT NULL,
ALTER COLUMN "salePrice" DROP NOT NULL,
ALTER COLUMN "stock" DROP NOT NULL,
ALTER COLUMN "regularPrice" DROP NOT NULL,
ALTER COLUMN "discountPercentage" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "email",
DROP COLUMN "googleId",
DROP COLUMN "password",
DROP COLUMN "provider",
DROP COLUMN "status";

-- DropTable
DROP TABLE "admin";

-- DropTable
DROP TABLE "customers_address";

-- DropTable
DROP TABLE "followers";

-- DropTable
DROP TABLE "parent_categories";

-- DropTable
DROP TABLE "shipping_addresses";

-- DropTable
DROP TABLE "shops";

-- DropTable
DROP TABLE "vendors";

-- DropEnum
DROP TYPE "Provider";

-- DropEnum
DROP TYPE "UserStatus";

-- CreateTable
CREATE TABLE "accounts" (
    "userId" TEXT NOT NULL,
    "authProvider" "AuthProvider" NOT NULL,
    "email" TEXT,
    "password" TEXT,
    "googleId" TEXT,
    "facebookId" TEXT,
    "status" "AccountStatus" NOT NULL DEFAULT 'Active',
    "passwordChangedAt" TIMESTAMP(3),
    "lastLoginAt" TIMESTAMP(3),

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "staffs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "profilePhoto" TEXT,
    "gender" "UserGender",

    CONSTRAINT "staffs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "zone" TEXT NOT NULL,
    "line" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "variants" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "colorName" VARCHAR(20) NOT NULL,
    "colorCode" VARCHAR(6) NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "salePrice" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION NOT NULL,
    "discountPercentage" INTEGER NOT NULL,
    "stock" INTEGER NOT NULL,
    "isHighlighted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "variants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "variant_attributes" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "value" VARCHAR(20) NOT NULL,

    CONSTRAINT "variant_attributes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_specifications" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "value" VARCHAR(100) NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "product_specifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discount_customer_ids" (
    "discountId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,

    CONSTRAINT "discount_customer_ids_pkey" PRIMARY KEY ("discountId","customerId")
);

-- CreateTable
CREATE TABLE "discount_category_ids" (
    "discountId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "discount_category_ids_pkey" PRIMARY KEY ("discountId","categoryId")
);

-- CreateTable
CREATE TABLE "shipping_information" (
    "orderId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "zone" TEXT NOT NULL,
    "line" TEXT NOT NULL,

    CONSTRAINT "shipping_information_pkey" PRIMARY KEY ("orderId")
);

-- CreateTable
CREATE TABLE "order_item_attributes" (
    "orderItemId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "order_item_attributes_pkey" PRIMARY KEY ("orderItemId")
);

-- CreateTable
CREATE TABLE "brands" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" VARCHAR(5000) NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "origin" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search_keywords" (
    "id" TEXT NOT NULL,
    "keyword" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 1,

    CONSTRAINT "search_keywords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_searches" (
    "id" SERIAL NOT NULL,
    "keyword" TEXT NOT NULL,
    "query" VARCHAR(500) NOT NULL,
    "results" INTEGER NOT NULL DEFAULT 0,
    "searchDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ipAddress" VARCHAR(45),
    "device" VARCHAR(100),
    "location" VARCHAR(255),
    "filters" JSONB,
    "customerId" TEXT NOT NULL,

    CONSTRAINT "customer_searches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_activities" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "loginAt" TIMESTAMP(3) NOT NULL,
    "logoutAt" TIMESTAMP(3),
    "ipAddress" TEXT,
    "browser" "Browser" NOT NULL,

    CONSTRAINT "user_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "imageUrl" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "link" TEXT,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "accounts_googleId_key" ON "accounts"("googleId");

-- CreateIndex
CREATE UNIQUE INDEX "accounts_facebookId_key" ON "accounts"("facebookId");

-- CreateIndex
CREATE UNIQUE INDEX "staffs_id_key" ON "staffs"("id");

-- CreateIndex
CREATE UNIQUE INDEX "staffs_userId_key" ON "staffs"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "variants_sku_key" ON "variants"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "brands_name_key" ON "brands"("name");

-- CreateIndex
CREATE UNIQUE INDEX "search_keywords_keyword_key" ON "search_keywords"("keyword");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "coupons_couponCode_key" ON "coupons"("couponCode");

-- CreateIndex
CREATE UNIQUE INDEX "products_slug_key" ON "products"("slug");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staffs" ADD CONSTRAINT "staffs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variants" ADD CONSTRAINT "variants_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "variant_attributes" ADD CONSTRAINT "variant_attributes_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_specifications" ADD CONSTRAINT "product_specifications_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discount_customer_ids" ADD CONSTRAINT "discount_customer_ids_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "coupons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "discount_category_ids" ADD CONSTRAINT "discount_category_ids_discountId_fkey" FOREIGN KEY ("discountId") REFERENCES "coupons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "variants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "shipping_information" ADD CONSTRAINT "shipping_information_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "categories" ADD CONSTRAINT "categories_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "variants"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_searches" ADD CONSTRAINT "customer_searches_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_staffId_fkey" FOREIGN KEY ("staffId") REFERENCES "staffs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_activities" ADD CONSTRAINT "user_activities_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
