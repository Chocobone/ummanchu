/*
  Warnings:

  - The primary key for the `AboutContent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `AboutContent` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "public"."AboutContent_page_key";

-- AlterTable
ALTER TABLE "public"."AboutContent" DROP CONSTRAINT "AboutContent_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "AboutContent_pkey" PRIMARY KEY ("page");

-- AlterTable
ALTER TABLE "public"."HomePageContent" ADD COLUMN     "fontFamily" TEXT;
