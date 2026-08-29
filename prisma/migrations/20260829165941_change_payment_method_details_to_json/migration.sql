/*
  Warnings:

  - Changed the type of `details` on the `payment_methods` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "payment_methods" DROP COLUMN "details",
ADD COLUMN     "details" JSONB NOT NULL;
