/*
  Warnings:

  - You are about to drop the column `boughtTypeId` on the `licenses` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "licenses" DROP CONSTRAINT "licenses_boughtTypeId_fkey";

-- AlterTable
ALTER TABLE "connections" ALTER COLUMN "ip" DROP NOT NULL;

-- AlterTable
ALTER TABLE "licenses" DROP COLUMN "boughtTypeId",
ADD COLUMN     "boughtType" VARCHAR;
