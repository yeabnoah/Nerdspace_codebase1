/*
  Warnings:

  - You are about to drop the `postbookmarks` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `postlikes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "postbookmarks" DROP CONSTRAINT "postbookmarks_postId_fkey";

-- DropForeignKey
ALTER TABLE "postbookmarks" DROP CONSTRAINT "postbookmarks_userId_fkey";

-- DropForeignKey
ALTER TABLE "postlikes" DROP CONSTRAINT "postlikes_postId_fkey";

-- DropForeignKey
ALTER TABLE "postlikes" DROP CONSTRAINT "postlikes_userId_fkey";

-- DropTable
DROP TABLE "postbookmarks";

-- DropTable
DROP TABLE "postlikes";
