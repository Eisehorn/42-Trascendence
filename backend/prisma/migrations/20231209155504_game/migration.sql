/*
  Warnings:

  - Added the required column `isDirectChat` to the `ChatChannel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChatChannel" ADD COLUMN     "isDirectChat" BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "points" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Match" (
    "id" TEXT NOT NULL,
    "winner" TEXT NOT NULL,
    "looser" TEXT NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id")
);
