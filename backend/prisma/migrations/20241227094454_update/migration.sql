/*
  Warnings:

  - You are about to alter the column `otp` on the `new_account_verifications` table. The data in that column could be lost. The data in that column will be cast from `Integer` to `VarChar(6)`.

*/
-- AlterTable
ALTER TABLE "new_account_verifications" ALTER COLUMN "otp" SET DATA TYPE VARCHAR(6);
