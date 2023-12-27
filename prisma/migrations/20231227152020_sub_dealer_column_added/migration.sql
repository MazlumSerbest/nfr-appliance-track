-- AlterTable
ALTER TABLE "appliances" ADD COLUMN     "subDealerId" INTEGER;

-- AlterTable
ALTER TABLE "licenses" ADD COLUMN     "subDealerId" INTEGER;

-- AddForeignKey
ALTER TABLE "appliances" ADD CONSTRAINT "appliances_subDealerId_fkey" FOREIGN KEY ("subDealerId") REFERENCES "dealers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "licenses" ADD CONSTRAINT "licenses_subDealerId_fkey" FOREIGN KEY ("subDealerId") REFERENCES "dealers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
