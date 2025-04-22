/*
  Warnings:

  - You are about to drop the `notification` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('POST_LIKE', 'POST_COMMENT', 'NEW_FOLLOWER', 'PROJECT_UPDATE', 'PROJECT_STAR', 'COMMUNITY_INVITE');

-- DropForeignKey
ALTER TABLE "notification" DROP CONSTRAINT "notification_commentId_fkey";

-- DropForeignKey
ALTER TABLE "notification" DROP CONSTRAINT "notification_followerId_fkey";

-- DropForeignKey
ALTER TABLE "notification" DROP CONSTRAINT "notification_postId_fkey";

-- DropForeignKey
ALTER TABLE "notification" DROP CONSTRAINT "notification_userId_fkey";

-- DropTable
DROP TABLE "notification";

-- DropEnum
DROP TYPE "notificationType";

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "postId" TEXT,
    "commentId" TEXT,
    "followerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
