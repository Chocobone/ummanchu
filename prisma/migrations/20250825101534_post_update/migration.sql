-- AlterTable
ALTER TABLE "public"."Research" ALTER COLUMN "contentHtml" DROP NOT NULL,
ALTER COLUMN "contentHtml" DROP DEFAULT;
