/*
  Warnings:

  - A unique constraint covering the columns `[userId,postId]` on the table `postbookmarks` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,postId]` on the table `postlikes` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "postbookmarks_userId_postId_key" ON "postbookmarks"("userId", "postId");

-- CreateIndex
CREATE UNIQUE INDEX "postlikes_userId_postId_key" ON "postlikes"("userId", "postId");
