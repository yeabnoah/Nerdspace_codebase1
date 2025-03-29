-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
