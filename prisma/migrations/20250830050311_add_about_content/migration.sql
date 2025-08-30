-- CreateTable
CREATE TABLE "public"."Contact" (
    "id" SERIAL NOT NULL,
    "labNameKo" TEXT NOT NULL,
    "labNameEn" TEXT NOT NULL,
    "addressKo" TEXT NOT NULL,
    "addressEn" TEXT NOT NULL,
    "mapEmbedUrl" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AboutContent" (
    "id" SERIAL NOT NULL,
    "page" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AboutContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AboutContent_page_key" ON "public"."AboutContent"("page");
