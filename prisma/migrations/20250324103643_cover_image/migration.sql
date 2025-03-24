/*
  Warnings:

  - You are about to drop the column `coverImage` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "coverImage";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "coverImage" TEXT;
