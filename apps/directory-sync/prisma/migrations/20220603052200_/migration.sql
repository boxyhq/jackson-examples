/*
  Warnings:

  - You are about to drop the column `directoryId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[directoryUserId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `directoryUserId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "directoryId",
ADD COLUMN     "directoryUserId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_directoryUserId_key" ON "User"("directoryUserId");
