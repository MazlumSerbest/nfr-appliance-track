/*
  Warnings:

  - You are about to drop the column `boughtOn` on the `appliances` table. All the data in the column will be lost.
  - You are about to drop the column `soldOn` on the `appliances` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `customers` table. All the data in the column will be lost.
  - Made the column `name` on table `customers` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "appliances" DROP COLUMN "boughtOn",
DROP COLUMN "soldOn",
ADD COLUMN     "boughtAt" DATE,
ADD COLUMN     "soldAt" DATE,
ALTER COLUMN "active" SET DEFAULT true;

-- AlterTable
ALTER TABLE "connections" ADD COLUMN     "ip" VARCHAR;

-- AlterTable
ALTER TABLE "customers" DROP COLUMN "city",
ALTER COLUMN "active" SET DEFAULT true,
ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "dealers" ADD COLUMN     "email" VARCHAR,
ADD COLUMN     "phone" VARCHAR,
ALTER COLUMN "active" SET DEFAULT true;

-- AlterTable
ALTER TABLE "licenses" ADD COLUMN     "boughtAt" DATE,
ADD COLUMN     "boughtType" VARCHAR,
ADD COLUMN     "soldAt" DATE,
ALTER COLUMN "active" SET DEFAULT true;

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "active" SET DEFAULT true;

-- AlterTable
ALTER TABLE "suppliers" ADD COLUMN     "email" VARCHAR,
ADD COLUMN     "phone" VARCHAR,
ALTER COLUMN "active" SET DEFAULT true;
