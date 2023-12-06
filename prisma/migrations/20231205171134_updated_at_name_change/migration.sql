/*
  Warnings:

  - You are about to drop the column `updateAt` on the `appliances` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `connections` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `dealers` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `licenses` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `suppliers` table. All the data in the column will be lost.
  - You are about to drop the column `updateAt` on the `users` table. All the data in the column will be lost.
  - Added the required column `createdBy` to the `licenseTypes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "appliances" DROP COLUMN "updateAt",
ADD COLUMN     "updatedAt" TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "connections" DROP COLUMN "updateAt",
ADD COLUMN     "updatedAt" TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "customers" DROP COLUMN "updateAt",
ADD COLUMN     "updatedAt" TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "dealers" DROP COLUMN "updateAt",
ADD COLUMN     "updatedAt" TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "licenseTypes" ADD COLUMN     "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "createdBy" VARCHAR NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMPTZ,
ADD COLUMN     "updatedBy" VARCHAR;

-- AlterTable
ALTER TABLE "licenses" DROP COLUMN "updateAt",
ADD COLUMN     "updatedAt" TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "updateAt",
ADD COLUMN     "updatedAt" TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "suppliers" DROP COLUMN "updateAt",
ADD COLUMN     "updatedAt" TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "users" DROP COLUMN "updateAt",
ADD COLUMN     "updatedAt" TIMESTAMPTZ;
