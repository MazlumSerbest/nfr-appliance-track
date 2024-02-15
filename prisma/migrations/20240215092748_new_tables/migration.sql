/*
  Warnings:

  - You are about to drop the column `brand` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "appliances" ADD COLUMN     "note" VARCHAR;

-- AlterTable
ALTER TABLE "licenses" ADD COLUMN     "note" VARCHAR,
ADD COLUMN     "orderedAt" TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "products" DROP COLUMN "brand",
DROP COLUMN "type",
ADD COLUMN     "brandId" INTEGER,
ADD COLUMN     "productTypeId" INTEGER;

-- CreateTable
CREATE TABLE "brands" (
    "id" SERIAL NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "name" VARCHAR NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" VARCHAR NOT NULL,
    "updatedAt" TIMESTAMPTZ(6),
    "updatedBy" VARCHAR,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "productTypes" (
    "id" SERIAL NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "type" VARCHAR NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" VARCHAR NOT NULL,
    "updatedAt" TIMESTAMPTZ(6),
    "updatedBy" VARCHAR,

    CONSTRAINT "productTypes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" SERIAL NOT NULL,
    "currentId" INTEGER NOT NULL,
    "name" VARCHAR NOT NULL,
    "address" VARCHAR NOT NULL,
    "city" VARCHAR NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" VARCHAR NOT NULL,
    "updatedBy" VARCHAR,
    "updatedAt" TIMESTAMPTZ(6),

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_productTypeId_fkey" FOREIGN KEY ("productTypeId") REFERENCES "productTypes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "products" ADD CONSTRAINT "products_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses" ADD CONSTRAINT "addresses_currentId_fkey" FOREIGN KEY ("currentId") REFERENCES "currents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
