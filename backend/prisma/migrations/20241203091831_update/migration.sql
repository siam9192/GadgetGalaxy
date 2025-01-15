/*
  Warnings:

  - The primary key for the `product_images` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `product_images` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "product_images" DROP CONSTRAINT "product_images_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "product_images_pkey" PRIMARY KEY ("id");
