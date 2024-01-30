/*
  Warnings:

  - You are about to alter the column `name` on the `authorizedPersons` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(100)`.
  - You are about to alter the column `password` on the `connections` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(100)`.
  - You are about to alter the column `note` on the `connections` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(400)`.
  - You are about to alter the column `ip` on the `connections` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(100)`.
  - You are about to alter the column `name` on the `currents` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(100)`.
  - You are about to alter the column `address` on the `currents` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(400)`.
  - You are about to alter the column `taxOffice` on the `currents` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(100)`.
  - You are about to alter the column `name` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(100)`.
  - You are about to alter the column `password` on the `users` table. The data in that column could be lost. The data in that column will be cast from `VarChar` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE "authorizedPersons" ALTER COLUMN "name" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "connections" ALTER COLUMN "password" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "note" SET DATA TYPE VARCHAR(400),
ALTER COLUMN "ip" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "currents" ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "address" SET DATA TYPE VARCHAR(400),
ALTER COLUMN "taxOffice" SET DATA TYPE VARCHAR(100);

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "name" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "password" SET DATA TYPE VARCHAR(100);
