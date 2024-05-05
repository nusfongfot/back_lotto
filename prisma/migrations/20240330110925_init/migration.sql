-- CreateTable
CREATE TABLE "Company" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "Company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Lotto" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,
    "roundNumber" INTEGER NOT NULL,
    "bookNumber" INTEGER NOT NULL,

    CONSTRAINT "Lotto_pkey" PRIMARY KEY ("id")
);
