/*
  Warnings:

  - You are about to drop the column `ratting` on the `product_reviews` table. All the data in the column will be lost.
  - Added the required column `rating` to the `product_reviews` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product_reviews" DROP COLUMN "ratting",
ADD COLUMN     "rating" DOUBLE PRECISION NOT NULL;
