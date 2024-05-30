/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `Player` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Player` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Player_cpf_key" ON "Player"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "Player_email_key" ON "Player"("email");
