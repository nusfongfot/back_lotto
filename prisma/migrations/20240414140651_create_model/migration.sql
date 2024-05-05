-- CreateTable
CREATE TABLE "BillSale" (
    "id" SERIAL NOT NULL,
    "payDate" TIMESTAMP(3),
    "customerName" TEXT NOT NULL,
    "customerPhone" TEXT NOT NULL,
    "customerAddress" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "BillSale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillSaleDetail" (
    "id" SERIAL NOT NULL,
    "billSaleId" INTEGER NOT NULL,
    "lottoId" INTEGER NOT NULL,

    CONSTRAINT "BillSaleDetail_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BillSaleDetail" ADD CONSTRAINT "BillSaleDetail_billSaleId_fkey" FOREIGN KEY ("billSaleId") REFERENCES "BillSale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillSaleDetail" ADD CONSTRAINT "BillSaleDetail_lottoId_fkey" FOREIGN KEY ("lottoId") REFERENCES "Lotto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
