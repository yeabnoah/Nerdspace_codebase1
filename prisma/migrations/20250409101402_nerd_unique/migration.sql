/*
  Warnings:

  - A unique constraint covering the columns `[nerdAt]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_nerdAt_key" ON "user"("nerdAt");
