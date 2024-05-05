-- CreateTable
CREATE TABLE "BonusResult" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "roundNumber" INTEGER NOT NULL,
    "roundName" INTEGER NOT NULL,
    "bonusOne" INTEGER NOT NULL,
    "bonusOnePrice" INTEGER NOT NULL,
    "bonusTwo" INTEGER NOT NULL,
    "bonusTwoPrice" INTEGER NOT NULL,
    "bonusThree" INTEGER NOT NULL,
    "bonusThreePrice" INTEGER NOT NULL,

    CONSTRAINT "BonusResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BonusResultDetail" (
    "id" SERIAL NOT NULL,
    "number" INTEGER NOT NULL,
    "bonusResultId" INTEGER NOT NULL,

    CONSTRAINT "BonusResultDetail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BonusResultDetail" ADD CONSTRAINT "BonusResultDetail_bonusResultId_fkey" FOREIGN KEY ("bonusResultId") REFERENCES "BonusResult"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
