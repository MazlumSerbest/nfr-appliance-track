-- DropForeignKey
ALTER TABLE "authorizedPersons" DROP CONSTRAINT "authorizedPersons_currentId_fkey";

-- AddForeignKey
ALTER TABLE "authorizedPersons" ADD CONSTRAINT "authorizedPersons_currentId_fkey" FOREIGN KEY ("currentId") REFERENCES "currents"("id") ON DELETE CASCADE ON UPDATE CASCADE;
