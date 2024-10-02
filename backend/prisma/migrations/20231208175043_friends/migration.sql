/*
  Warnings:

  - Added the required column `message` to the `ChatMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChatMessage" ADD COLUMN     "message" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "friends" TEXT[];

-- CreateTable
CREATE TABLE "FriendRequest" (
    "id" TEXT NOT NULL,
    "sender" TEXT NOT NULL,
    "target" TEXT NOT NULL,

    CONSTRAINT "FriendRequest_pkey" PRIMARY KEY ("id")
);
