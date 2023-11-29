/*
  Warnings:

  - Made the column `createdAt` on table `users` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdBy` on table `users` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "appliances" ALTER COLUMN "updateAt" DROP NOT NULL,
ALTER COLUMN "boughtOn" DROP NOT NULL,
ALTER COLUMN "soldOn" DROP NOT NULL,
ALTER COLUMN "updatedBy" DROP NOT NULL;

-- AlterTable
ALTER TABLE "connections" ALTER COLUMN "updateAt" DROP NOT NULL,
ALTER COLUMN "updatedBy" DROP NOT NULL;

-- AlterTable
ALTER TABLE "customers" ALTER COLUMN "updateAt" DROP NOT NULL,
ALTER COLUMN "updatedBy" DROP NOT NULL;

-- AlterTable
ALTER TABLE "dealers" ALTER COLUMN "updatedBy" DROP NOT NULL,
ALTER COLUMN "updateAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "licenses" ALTER COLUMN "startDate" DROP NOT NULL,
ALTER COLUMN "expiryDate" DROP NOT NULL,
ALTER COLUMN "updatedBy" DROP NOT NULL,
ALTER COLUMN "updateAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "updateAt" DROP NOT NULL,
ALTER COLUMN "updatedBy" DROP NOT NULL;

-- AlterTable
ALTER TABLE "suppliers" ALTER COLUMN "updatedBy" DROP NOT NULL,
ALTER COLUMN "updateAt" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "createdAt" SET NOT NULL,
ALTER COLUMN "createdBy" SET NOT NULL;
