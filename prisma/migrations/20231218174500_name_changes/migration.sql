/*
  Warnings:

  - A unique constraint covering the columns `[serialNo]` on the table `appliances` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "appliances_serialNo_key" ON "appliances"("serialNo");
