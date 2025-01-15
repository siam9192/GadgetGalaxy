/*
  Warnings:

  - You are about to drop the column `image_url` on the `parent_categories` table. All the data in the column will be lost.
  - Added the required column `featuredImage` to the `parent_categories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "parent_categories" DROP COLUMN "image_url",
ADD COLUMN     "featuredImage" TEXT NOT NULL;
