/*
  Warnings:

  - You are about to drop the column `userId` on the `FriendRequest` table. All the data in the column will be lost.
  - Added the required column `targetId` to the `FriendRequest` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FriendRequest" DROP CONSTRAINT "FriendRequest_userId_fkey";

-- AlterTable
ALTER TABLE "FriendRequest" DROP COLUMN "userId",
ADD COLUMN     "targetId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "FriendRequest" ADD CONSTRAINT "FriendRequest_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
