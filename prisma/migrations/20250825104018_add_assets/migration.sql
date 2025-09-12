-- CreateEnum
CREATE TYPE "public"."AssetOwnerType" AS ENUM ('RESEARCH', 'NEWS');

-- CreateTable
CREATE TABLE "public"."Asset" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "originalName" TEXT,
    "mime" TEXT,
    "size" INTEGER,
    "ownerType" "public"."AssetOwnerType" NOT NULL,
    "ownerId" TEXT NOT NULL,
    "tag" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Asset_ownerType_ownerId_idx" ON "public"."Asset"("ownerType", "ownerId");
