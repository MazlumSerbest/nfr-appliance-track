-- AlterTable
ALTER TABLE "connections" ADD COLUMN     "customerId" INTEGER;

-- AddForeignKey
ALTER TABLE "connections" ADD CONSTRAINT "connections_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
