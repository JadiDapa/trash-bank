/*
  Warnings:

  - Added the required column `grammage` to the `PointExchange` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PointExchange" ADD COLUMN     "grammage" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "grammage" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "points" INTEGER NOT NULL DEFAULT 0;
