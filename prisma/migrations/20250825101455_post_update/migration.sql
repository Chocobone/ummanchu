/*
  Warnings:

  - You are about to drop the column `subtitle` on the `Research` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Research" DROP COLUMN "subtitle",
ADD COLUMN     "contentHtml" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "description" DROP NOT NULL;
