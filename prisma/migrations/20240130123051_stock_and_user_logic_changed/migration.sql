/*
  Warnings:

  - You are about to drop the column `isStock` on the `licenses` table. All the data in the column will be lost.
  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "currents" ADD COLUMN     "paymentPlan" VARCHAR;

-- AlterTable
ALTER TABLE "licenses" DROP COLUMN "isStock";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL DEFAULT 'seller';

-- DropEnum
DROP TYPE "UserRole";
