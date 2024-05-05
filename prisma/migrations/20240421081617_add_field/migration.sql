-- AlterTable
ALTER TABLE "BillSale" ADD COLUMN     "deliveryDate" TIMESTAMP(3),
ADD COLUMN     "price" INTEGER,
ADD COLUMN     "transferMoneyDate" TIMESTAMP(3),
ADD COLUMN     "transferMoneyTime" TEXT;

-- CreateTable
CREATE TABLE "BillSaleDetailBonus" (
    "id" SERIAL NOT NULL,
    "billSaleDetailId" INTEGER NOT NULL,
    "bonusPrice" INTEGER NOT NULL,
    "bonusDate" TIMESTAMP(3) NOT NULL,
    "number" TEXT NOT NULL,
    "cost" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,

    CONSTRAINT "BillSaleDetailBonus_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BillSaleDetailBonus" ADD CONSTRAINT "BillSaleDetailBonus_billSaleDetailId_fkey" FOREIGN KEY ("billSaleDetailId") REFERENCES "BillSaleDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
