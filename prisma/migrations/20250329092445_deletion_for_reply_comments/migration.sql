-- DropForeignKey
ALTER TABLE "postcomments" DROP CONSTRAINT "postcomments_parentId_fkey";

-- AddForeignKey
ALTER TABLE "postcomments" ADD CONSTRAINT "postcomments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "postcomments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
