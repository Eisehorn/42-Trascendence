/*
  Warnings:

  - Added the required column `channelId` to the `ChatMatchInvite` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChatMatchInvite" ADD COLUMN     "channelId" TEXT NOT NULL;
