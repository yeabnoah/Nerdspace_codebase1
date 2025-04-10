-- AlterTable
ALTER TABLE "posts" ADD COLUMN     "originalPostId" TEXT;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_originalPostId_fkey" FOREIGN KEY ("originalPostId") REFERENCES "posts"("id") ON DELETE SET NULL ON UPDATE CASCADE;
