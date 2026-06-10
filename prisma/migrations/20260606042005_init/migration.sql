-- CreateEnum
CREATE TYPE "DepositTicketStatus" AS ENUM ('PENDING', 'COMPLETED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('LAKI_LAKI', 'PEREMPUAN');

-- CreateEnum
CREATE TYPE "MasyarakatStatus" AS ENUM ('WAITING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'MASYARAKAT');

-- CreateEnum
CREATE TYPE "VoucherTicketStatus" AS ENUM ('PENDING', 'COMPLETED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "bankName" TEXT NOT NULL,
    "bankAddress" TEXT NOT NULL,
    "bankArea" TEXT NOT NULL,
    "operatingHours" TEXT NOT NULL,
    "phone" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DepositTicket" (
    "id" SERIAL NOT NULL,
    "masyarakatId" INTEGER NOT NULL,
    "adminId" INTEGER NOT NULL,
    "status" "DepositTicketStatus" NOT NULL DEFAULT 'PENDING',
    "estimatedGrammage" DOUBLE PRECISION NOT NULL,
    "actualGrammage" DOUBLE PRECISION,
    "pointsEarned" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DepositTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Education" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Masyarakat" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "gender" "Gender" NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "ktpImageUrl" TEXT NOT NULL,
    "status" "MasyarakatStatus" NOT NULL DEFAULT 'WAITING',
    "rejectedReason" TEXT,
    "points" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "totalGrammage" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Masyarakat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "grammageToPointRate" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "pointsToVoucherRate" DOUBLE PRECISION NOT NULL DEFAULT 25000,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "clerkId" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'MASYARAKAT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoucherTicket" (
    "id" SERIAL NOT NULL,
    "masyarakatId" INTEGER NOT NULL,
    "adminId" INTEGER NOT NULL,
    "status" "VoucherTicketStatus" NOT NULL DEFAULT 'PENDING',
    "pointsUsed" DOUBLE PRECISION NOT NULL,
    "voucherSerial" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VoucherTicket_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_userId_key" ON "Admin"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Masyarakat_userId_key" ON "Masyarakat"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Masyarakat_nik_key" ON "Masyarakat"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkId_key" ON "User"("clerkId");

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepositTicket" ADD CONSTRAINT "DepositTicket_masyarakatId_fkey" FOREIGN KEY ("masyarakatId") REFERENCES "Masyarakat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepositTicket" ADD CONSTRAINT "DepositTicket_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Education" ADD CONSTRAINT "Education_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Masyarakat" ADD CONSTRAINT "Masyarakat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoucherTicket" ADD CONSTRAINT "VoucherTicket_masyarakatId_fkey" FOREIGN KEY ("masyarakatId") REFERENCES "Masyarakat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoucherTicket" ADD CONSTRAINT "VoucherTicket_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "Admin"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
