/*
  Warnings:

  - Made the column `productId` on table `appliances` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "appliances" DROP CONSTRAINT "appliances_productId_fkey";

-- AlterTable
ALTER TABLE "appliances" ALTER COLUMN "productId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "appliances" ADD CONSTRAINT "appliances_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
