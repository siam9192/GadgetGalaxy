/*
  Warnings:

  - You are about to drop the column `isActive` on the `products` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('Active', 'InActive', 'Deleted');

-- AlterTable
ALTER TABLE "products" DROP COLUMN "isActive",
ADD COLUMN     "status" "ProductStatus" NOT NULL DEFAULT 'Active';
