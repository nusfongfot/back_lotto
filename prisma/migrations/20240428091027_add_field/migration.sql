/*
  Warnings:

  - Added the required column `lottoId` to the `LottoIsBonus` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LottoIsBonus" ADD COLUMN     "lottoId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "LottoIsBonus" ADD CONSTRAINT "LottoIsBonus_lottoId_fkey" FOREIGN KEY ("lottoId") REFERENCES "Lotto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
