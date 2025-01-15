/*
  Warnings:

  - You are about to drop the column `discount` on the `variants` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `variants` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "variants" DROP COLUMN "discount",
DROP COLUMN "price";
