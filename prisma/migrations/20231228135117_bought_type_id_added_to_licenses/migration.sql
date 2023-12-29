/*
  Warnings:

  - You are about to drop the column `boughtType` on the `licenses` table. All the data in the column will be lost.
  - Made the column `ip` on table `connections` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "connections" ALTER COLUMN "ip" SET NOT NULL;

-- AlterTable
ALTER TABLE "licenses" DROP COLUMN "boughtType",
ADD COLUMN     "boughtTypeId" INTEGER;

-- AddForeignKey
ALTER TABLE "licenses" ADD CONSTRAINT "licenses_boughtTypeId_fkey" FOREIGN KEY ("boughtTypeId") REFERENCES "boughtTypes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
