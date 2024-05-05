-- CreateTable
CREATE TABLE "BillSaleForSend" (
    "id" SERIAL NOT NULL,
    "billSaleId" INTEGER NOT NULL,
    "sender" TEXT,
    "sendDate" TIMESTAMP(3) NOT NULL,
    "sendTime" TEXT NOT NULL,
    "trackCode" TEXT NOT NULL,
    "sendPlatform" TEXT NOT NULL,
    "remark" TEXT,
    "shippingCost" INTEGER NOT NULL,

    CONSTRAINT "BillSaleForSend_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "BillSaleForSend" ADD CONSTRAINT "BillSaleForSend_billSaleId_fkey" FOREIGN KEY ("billSaleId") REFERENCES "BillSale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
