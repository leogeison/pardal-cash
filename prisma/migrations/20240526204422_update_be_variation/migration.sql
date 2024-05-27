/*
  Warnings:

  - You are about to drop the column `ticketId` on the `BetVariation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "BetVariation" DROP CONSTRAINT "BetVariation_ticketId_fkey";

-- AlterTable
ALTER TABLE "BetVariation" DROP COLUMN "ticketId";
