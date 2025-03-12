/*
  Warnings:

  - Added the required column `access` to the `posts` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PostAccess" AS ENUM ('private', 'public');

-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "access" "PostAccess" NOT NULL;
