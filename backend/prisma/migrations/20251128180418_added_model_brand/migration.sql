-- CreateEnum
CREATE TYPE "BrandType" AS ENUM ('DESIGNER', 'NICHE', 'MASS_MARKET', 'INDIE');

-- CreateEnum
CREATE TYPE "ImageType" AS ENUM ('PRODUCT', 'BRAND');

-- CreateTable
CREATE TABLE "brand" (
    "id" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "shortTitle" TEXT,
    "shortDescription" TEXT,
    "type" "BrandType" DEFAULT 'MASS_MARKET',
    "countryCode" TEXT,
    "sortOrder" INTEGER DEFAULT 0,
    "imageId" TEXT,

    CONSTRAINT "brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "image" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "type" "ImageType" NOT NULL,
    "url" TEXT NOT NULL,
    "parentId" TEXT NOT NULL,

    CONSTRAINT "image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "brand_slug_key" ON "brand"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "brand_title_key" ON "brand"("title");

-- CreateIndex
CREATE UNIQUE INDEX "brand_imageId_key" ON "brand"("imageId");

-- AddForeignKey
ALTER TABLE "brand" ADD CONSTRAINT "brand_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "image"("id") ON DELETE SET NULL ON UPDATE CASCADE;
