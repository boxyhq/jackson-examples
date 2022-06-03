/*
  Warnings:

  - The primary key for the `UserGroup` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `UserGroup` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserGroup" DROP CONSTRAINT "UserGroup_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "UserGroup_pkey" PRIMARY KEY ("userId", "groupId");
