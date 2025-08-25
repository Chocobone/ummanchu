-- CreateTable
CREATE TABLE "public"."HomePageContent" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "heroTitle" TEXT NOT NULL,
    "heroSubtitle" TEXT NOT NULL,
    "heroParagraph" TEXT NOT NULL,
    "aboutTitle" TEXT NOT NULL,
    "aboutParagraph" TEXT NOT NULL,
    "newsTitle" TEXT NOT NULL,
    "newsSubtitle" TEXT NOT NULL,

    CONSTRAINT "HomePageContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SliderImage" (
    "id" SERIAL NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "altText" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SliderImage_pkey" PRIMARY KEY ("id")
);
