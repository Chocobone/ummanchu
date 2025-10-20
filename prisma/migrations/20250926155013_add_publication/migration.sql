-- CreateTable
CREATE TABLE "public"."Publication" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "authors" TEXT NOT NULL,
    "venue" TEXT,
    "year" INTEGER NOT NULL,
    "month" INTEGER,
    "url" TEXT,
    "pdfUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Publication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_publication_year" ON "public"."Publication"("year");
