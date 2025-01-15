/*
  Warnings:

  - A unique constraint covering the columns `[vendorId]` on the table `shops` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `vendorId` to the `shops` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "shops" ADD COLUMN     "vendorId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "vendors" ALTER COLUMN "profilePhoto" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "shops_vendorId_key" ON "shops"("vendorId");

-- AddForeignKey
ALTER TABLE "shops" ADD CONSTRAINT "shops_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "vendors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
