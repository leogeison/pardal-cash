-- CreateTable
CREATE TABLE "BetVariation" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "numbers" INTEGER[],

    CONSTRAINT "BetVariation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BetVariation" ADD CONSTRAINT "BetVariation_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
