/*
  Warnings:

  - Added the required column `fullName` to the `new_account_verifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "new_account_verifications" ADD COLUMN     "fullName" TEXT NOT NULL;
