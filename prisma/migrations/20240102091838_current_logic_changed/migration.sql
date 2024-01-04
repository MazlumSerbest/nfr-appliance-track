/*
  Warnings:

  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `customers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `dealers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `suppliers` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'user');

-- CreateEnum
CREATE TYPE "CurrentType" AS ENUM ('customer', 'dealer', 'supplier');

-- DropForeignKey
ALTER TABLE "appliances" DROP CONSTRAINT "appliances_customerId_fkey";

-- DropForeignKey
ALTER TABLE "appliances" DROP CONSTRAINT "appliances_dealerId_fkey";

-- DropForeignKey
ALTER TABLE "appliances" DROP CONSTRAINT "appliances_subDealerId_fkey";

-- DropForeignKey
ALTER TABLE "appliances" DROP CONSTRAINT "appliances_supplierId_fkey";

-- DropForeignKey
ALTER TABLE "connections" DROP CONSTRAINT "connections_customerId_fkey";

-- DropForeignKey
ALTER TABLE "licenses" DROP CONSTRAINT "licenses_customerId_fkey";

-- DropForeignKey
ALTER TABLE "licenses" DROP CONSTRAINT "licenses_dealerId_fkey";

-- DropForeignKey
ALTER TABLE "licenses" DROP CONSTRAINT "licenses_subDealerId_fkey";

-- DropForeignKey
ALTER TABLE "licenses" DROP CONSTRAINT "licenses_supplierId_fkey";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role",
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'user';

-- DropTable
DROP TABLE "customers";

-- DropTable
DROP TABLE "dealers";

-- DropTable
DROP TABLE "suppliers";

-- CreateTable
CREATE TABLE "currents" (
    "id" SERIAL NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "type" "CurrentType" NOT NULL DEFAULT 'customer',
    "name" VARCHAR NOT NULL,
    "phone" VARCHAR,
    "email" VARCHAR,
    "address" VARCHAR,
    "city" VARCHAR,
    "taxOffice" VARCHAR,
    "taxNo" VARCHAR,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" VARCHAR NOT NULL,
    "updatedBy" VARCHAR,
    "updatedAt" TIMESTAMPTZ(6),

    CONSTRAINT "currents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "authorizedPersons" (
    "id" SERIAL NOT NULL,
    "currentId" INTEGER NOT NULL,
    "name" VARCHAR NOT NULL,
    "isMain" BOOLEAN NOT NULL DEFAULT false,
    "title" VARCHAR,
    "phone" VARCHAR,
    "email" VARCHAR,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" VARCHAR NOT NULL,
    "updatedBy" VARCHAR,
    "updatedAt" TIMESTAMPTZ(6),

    CONSTRAINT "authorizedPersons_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "appliances" ADD CONSTRAINT "appliances_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "currents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appliances" ADD CONSTRAINT "appliances_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "currents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appliances" ADD CONSTRAINT "appliances_subDealerId_fkey" FOREIGN KEY ("subDealerId") REFERENCES "currents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appliances" ADD CONSTRAINT "appliances_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "currents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "licenses" ADD CONSTRAINT "licenses_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "currents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "licenses" ADD CONSTRAINT "licenses_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "currents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "licenses" ADD CONSTRAINT "licenses_subDealerId_fkey" FOREIGN KEY ("subDealerId") REFERENCES "currents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "licenses" ADD CONSTRAINT "licenses_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "currents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "connections" ADD CONSTRAINT "connections_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "currents"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "authorizedPersons" ADD CONSTRAINT "authorizedPersons_currentId_fkey" FOREIGN KEY ("currentId") REFERENCES "currents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
