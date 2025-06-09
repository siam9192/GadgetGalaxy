/*
  Warnings:

  - The values [ORDER_STATUS,PROMOTION,SYSTEM,ALERT] on the enum `NotificationType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `link` on the `notifications` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "NotificationCategory" AS ENUM ('SYSTEM', 'ORDER', 'WISHLIST', 'CARTITEM', 'PRODUCT', 'CATEGORY', 'PROMOTION', 'COUPON');

-- AlterEnum
BEGIN;
CREATE TYPE "NotificationType_new" AS ENUM ('WARNING', 'INFO');
ALTER TABLE "notifications" ALTER COLUMN "type" TYPE "NotificationType_new" USING ("type"::text::"NotificationType_new");
ALTER TYPE "NotificationType" RENAME TO "NotificationType_old";
ALTER TYPE "NotificationType_new" RENAME TO "NotificationType";
DROP TYPE "NotificationType_old";
COMMIT;

-- AlterTable
ALTER TABLE "notifications" DROP COLUMN "link",
ADD COLUMN     "category" "NotificationCategory" NOT NULL DEFAULT 'SYSTEM',
ADD COLUMN     "href" TEXT,
ADD COLUMN     "metaData" JSONB;
