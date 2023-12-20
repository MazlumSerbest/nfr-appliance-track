/*
  Warnings:

  - A unique constraint covering the columns `[serialNo]` on the table `licenses` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "licenses_serialNo_key" ON "licenses"("serialNo");
