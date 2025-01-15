/*
  Warnings:

  - Added the required column `regularPrice` to the `variants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "variants" ADD COLUMN     "regularPrice" DOUBLE PRECISION NOT NULL;
