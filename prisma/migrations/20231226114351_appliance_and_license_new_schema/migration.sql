/*
  Warnings:

  - You are about to drop the column `licenseId` on the `appliances` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `licenseTypes` table. All the data in the column will be lost.
  - You are about to drop the column `predecessorId` on the `licenses` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "appliances" DROP CONSTRAINT "appliances_licenseId_fkey";

-- DropForeignKey
ALTER TABLE "licenseTypes" DROP CONSTRAINT "licenseTypes_productId_fkey";

-- DropForeignKey
ALTER TABLE "licenses" DROP CONSTRAINT "licenses_predecessorId_fkey";

-- DropIndex
DROP INDEX "licenses_predecessorId_key";

-- AlterTable
ALTER TABLE "appliances" DROP COLUMN "licenseId";

-- AlterTable
ALTER TABLE "licenseTypes" DROP COLUMN "productId",
ADD COLUMN     "brand" VARCHAR;

-- AlterTable
ALTER TABLE "licenses" DROP COLUMN "predecessorId",
ADD COLUMN     "applianceId" INTEGER;

-- CreateTable
CREATE TABLE "boughtTypes" (
    "id" SERIAL NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "type" VARCHAR NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" VARCHAR NOT NULL,
    "updatedAt" TIMESTAMPTZ(6),
    "updatedBy" VARCHAR,

    CONSTRAINT "boughtTypes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "licenses" ADD CONSTRAINT "licenses_applianceId_fkey" FOREIGN KEY ("applianceId") REFERENCES "appliances"("id") ON DELETE SET NULL ON UPDATE CASCADE;
