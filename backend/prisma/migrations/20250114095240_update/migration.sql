/*
  Warnings:

  - You are about to drop the column `lastLoginAt` on the `accounts` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `accounts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "accounts" DROP COLUMN "lastLoginAt",
DROP COLUMN "status";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "lastLoginAt" TIMESTAMP(3),
ADD COLUMN     "status" "AccountStatus" NOT NULL DEFAULT 'Active';
