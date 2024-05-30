/*
  Warnings:

  - A unique constraint covering the columns `[numbers]` on the table `BetVariation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "BetVariation_numbers_key" ON "BetVariation"("numbers");
