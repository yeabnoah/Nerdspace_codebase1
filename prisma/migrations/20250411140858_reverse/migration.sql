/*
  Warnings:

  - You are about to drop the `shared_posts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "shared_posts" DROP CONSTRAINT "shared_posts_postId_fkey";

-- DropForeignKey
ALTER TABLE "shared_posts" DROP CONSTRAINT "shared_posts_userId_fkey";

-- DropTable
DROP TABLE "shared_posts";
