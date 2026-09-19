/*
  Warnings:

  - A unique constraint covering the columns `[user_id,slug]` on the table `invoices` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `invoices` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "slug" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "invoices_user_id_slug_key" ON "invoices"("user_id", "slug");
