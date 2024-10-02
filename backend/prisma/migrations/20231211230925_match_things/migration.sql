/*
  Warnings:

  - You are about to drop the column `looser` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `winner` on the `Match` table. All the data in the column will be lost.
  - Added the required column `looserId` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `winnerId` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Match" DROP COLUMN "looser",
DROP COLUMN "winner",
ADD COLUMN     "looserId" TEXT NOT NULL,
ADD COLUMN     "winnerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_looserId_fkey" FOREIGN KEY ("looserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
