/*
  Warnings:

  - You are about to drop the column `couponCode` on the `coupons` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `coupons` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `coupons` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "coupons_couponCode_key";

-- AlterTable
ALTER TABLE "coupons" DROP COLUMN "couponCode",
ADD COLUMN     "code" VARCHAR(20) NOT NULL;

-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "deletableCartItemsId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "coupons_code_key" ON "coupons"("code");
