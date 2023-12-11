/*
  Warnings:

  - Made the column `phone` on table `customers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `customers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `dealers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `dealers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `productId` on table `licenseTypes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `type` on table `licenseTypes` required. This step will fail if there are existing NULL values in that column.
  - Made the column `brand` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `model` on table `products` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `suppliers` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `suppliers` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "licenseTypes" DROP CONSTRAINT "licenseTypes_productId_fkey";

-- AlterTable
ALTER TABLE "appliances" ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "customers" ALTER COLUMN "phone" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL;

-- AlterTable
ALTER TABLE "dealers" ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "phone" SET NOT NULL;

-- AlterTable
ALTER TABLE "licenseTypes" ALTER COLUMN "productId" SET NOT NULL,
ALTER COLUMN "type" SET NOT NULL,
ALTER COLUMN "price" DROP NOT NULL;

-- AlterTable
ALTER TABLE "licenses" ADD COLUMN     "customerId" INTEGER,
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "brand" SET NOT NULL,
ALTER COLUMN "model" SET NOT NULL;

-- AlterTable
ALTER TABLE "suppliers" ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "phone" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "licenses" ADD CONSTRAINT "licenses_licenseTypeId_fkey" FOREIGN KEY ("licenseTypeId") REFERENCES "licenseTypes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "licenses" ADD CONSTRAINT "licenses_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "licenseTypes" ADD CONSTRAINT "licenseTypes_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
