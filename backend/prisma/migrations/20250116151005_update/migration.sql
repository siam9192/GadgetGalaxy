/*
  Warnings:

  - Made the column `discountValue` on table `coupons` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "coupons" ALTER COLUMN "discountValue" SET NOT NULL;
