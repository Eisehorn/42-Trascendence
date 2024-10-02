/*
  Warnings:

  - Added the required column `isPrivate` to the `ChatChannel` table without a default value. This is not possible if the table is not empty.
  - Added the required column `owner` to the `ChatChannel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ChatChannel" ADD COLUMN     "bannedUsers" TEXT[],
ADD COLUMN     "isPrivate" BOOLEAN NOT NULL,
ADD COLUMN     "owner" TEXT NOT NULL;
