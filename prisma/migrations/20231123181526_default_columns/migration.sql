/*
  Warnings:

  - You are about to drop the column `license` on the `appliances` table. All the data in the column will be lost.
  - You are about to drop the column `modelNo` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `products` table. All the data in the column will be lost.
  - Added the required column `boughtOn` to the `appliances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `soldOn` to the `appliances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedBy` to the `appliances` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `connections` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updateAt` to the `connections` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedBy` to the `connections` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updateAt` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedBy` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `createdBy` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updateAt` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedBy` to the `products` table without a default value. This is not possible if the table is not empty.
  - Made the column `username` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `email` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "appliances" DROP CONSTRAINT "appliances_customerId_fkey";

-- DropForeignKey
ALTER TABLE "appliances" DROP CONSTRAINT "appliances_productId_fkey";

-- AlterTable
ALTER TABLE "appliances" DROP COLUMN "license",
ADD COLUMN     "boughtOn" DATE NOT NULL,
ADD COLUMN     "dealerId" INTEGER,
ADD COLUMN     "licenseId" INTEGER,
ADD COLUMN     "serialNo" VARCHAR,
ADD COLUMN     "soldOn" DATE NOT NULL,
ADD COLUMN     "supplierId" INTEGER,
ADD COLUMN     "updatedBy" VARCHAR NOT NULL;

-- AlterTable
ALTER TABLE "connections" ADD COLUMN     "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" VARCHAR NOT NULL,
ADD COLUMN     "updateAt" TIMESTAMPTZ NOT NULL,
ADD COLUMN     "updatedBy" VARCHAR NOT NULL;

-- AlterTable
ALTER TABLE "customers" ADD COLUMN     "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" VARCHAR NOT NULL,
ADD COLUMN     "updateAt" TIMESTAMPTZ NOT NULL,
ADD COLUMN     "updatedBy" VARCHAR NOT NULL;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "modelNo",
DROP COLUMN "name",
ADD COLUMN     "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" VARCHAR NOT NULL,
ADD COLUMN     "model" VARCHAR,
ADD COLUMN     "updateAt" TIMESTAMPTZ NOT NULL,
ADD COLUMN     "updatedBy" VARCHAR NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" VARCHAR,
ADD COLUMN     "updateAt" TIMESTAMPTZ,
ADD COLUMN     "updatedBy" VARCHAR,
ALTER COLUMN "username" SET NOT NULL,
ALTER COLUMN "email" SET NOT NULL;

-- CreateTable
CREATE TABLE "licenses" (
    "id" SERIAL NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "isStock" BOOLEAN NOT NULL DEFAULT false,
    "startDate" DATE NOT NULL,
    "expiryDate" DATE NOT NULL,
    "createdBy" VARCHAR NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" VARCHAR NOT NULL,
    "updateAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "licenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dealers" (
    "id" SERIAL NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "name" VARCHAR NOT NULL,
    "createdBy" VARCHAR NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" VARCHAR NOT NULL,
    "updateAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "dealers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "suppliers" (
    "id" SERIAL NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "name" VARCHAR NOT NULL,
    "createdBy" VARCHAR NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedBy" VARCHAR NOT NULL,
    "updateAt" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "suppliers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "appliances" ADD CONSTRAINT "appliances_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "customers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appliances" ADD CONSTRAINT "appliances_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appliances" ADD CONSTRAINT "appliances_licenseId_fkey" FOREIGN KEY ("licenseId") REFERENCES "licenses"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appliances" ADD CONSTRAINT "appliances_dealerId_fkey" FOREIGN KEY ("dealerId") REFERENCES "dealers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appliances" ADD CONSTRAINT "appliances_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "suppliers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
