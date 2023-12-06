/*
  Warnings:

  - A unique constraint covering the columns `[predecessorId]` on the table `appliances` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[predecessorId]` on the table `licenses` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `licenseTypeId` to the `licenses` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "appliances" ADD COLUMN     "predecessorId" INTEGER;

-- AlterTable
ALTER TABLE "connections" ALTER COLUMN "createdAt" SET DATA TYPE TIMESTAMP;

-- AlterTable
ALTER TABLE "licenses" ADD COLUMN     "dealerId" INTEGER,
ADD COLUMN     "licenseTypeId" INTEGER NOT NULL,
ADD COLUMN     "predecessorId" INTEGER,
ADD COLUMN     "supplierId" INTEGER;

-- CreateTable
CREATE TABLE "licenseTypes" (
    "id" SERIAL NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "productId" INTEGER,
    "duration" INTEGER,
    "type" VARCHAR,
    "price" DECIMAL(9,2) NOT NULL,

    CONSTRAINT "licenseTypes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "appliances_predecessorId_key" ON "appliances"("predecessorId");

-- CreateIndex
CREATE UNIQUE INDEX "licenses_predecessorId_key" ON "licenses"("predecessorId");

-- AddForeignKey
ALTER TABLE "appliances" ADD CONSTRAINT "appliances_predecessorId_fkey" FOREIGN KEY ("predecessorId") REFERENCES "appliances"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "licenses" ADD CONSTRAINT "licenses_predecessorId_fkey" FOREIGN KEY ("predecessorId") REFERENCES "licenses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "licenses" ADD CONSTRAINT "licenses_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "dealers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "licenses" ADD CONSTRAINT "licenses_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "licenseTypes" ADD CONSTRAINT "licenseTypes_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;
