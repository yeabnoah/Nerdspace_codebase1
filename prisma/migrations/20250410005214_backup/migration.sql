/*
  Warnings:

  - You are about to drop the column `sharedContent` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the column `sharedFromId` on the `posts` table. All the data in the column will be lost.
  - You are about to drop the `media` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "media" DROP CONSTRAINT "media_postId_fkey";

-- DropForeignKey
ALTER TABLE "media" DROP CONSTRAINT "media_post_media_fkey";

-- DropForeignKey
ALTER TABLE "media" DROP CONSTRAINT "media_shared_media_fkey";

-- DropForeignKey
ALTER TABLE "posts" DROP CONSTRAINT "posts_sharedFromId_fkey";

-- AlterTable
ALTER TABLE "posts" DROP COLUMN "sharedContent",
DROP COLUMN "sharedFromId";

-- DropTable
DROP TABLE "media";

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "MediaType" NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
