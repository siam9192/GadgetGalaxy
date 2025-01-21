/*
  Warnings:

  - You are about to drop the column `name` on the `shipping_charges` table. All the data in the column will be lost.
  - Added the required column `title` to the `shipping_charges` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "shipping_charges" DROP COLUMN "name",
ADD COLUMN     "title" TEXT NOT NULL;
