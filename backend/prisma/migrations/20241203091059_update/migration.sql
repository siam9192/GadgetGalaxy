/*
  Warnings:

  - You are about to drop the column `price` on the `products` table. All the data in the column will be lost.
  - You are about to alter the column `discount` on the `products` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - Added the required column `regularPrice` to the `products` table without a default value. This is not possible if the table is not empty.
  - Made the column `salePrice` on table `products` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "products" DROP COLUMN "price",
ADD COLUMN     "regularPrice" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "salePrice" SET NOT NULL,
ALTER COLUMN "discount" SET DATA TYPE INTEGER;
