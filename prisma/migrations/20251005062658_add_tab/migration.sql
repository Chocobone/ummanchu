-- CreateTable
CREATE TABLE "public"."BoardTab" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BoardTab_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."BoardPost" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "contentHtml" TEXT,
    "imageUrl" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "tabId" INTEGER NOT NULL,

    CONSTRAINT "BoardPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BoardTab_name_key" ON "public"."BoardTab"("name");

-- CreateIndex
CREATE UNIQUE INDEX "BoardTab_slug_key" ON "public"."BoardTab"("slug");

-- AddForeignKey
ALTER TABLE "public"."BoardPost" ADD CONSTRAINT "BoardPost_tabId_fkey" FOREIGN KEY ("tabId") REFERENCES "public"."BoardTab"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
