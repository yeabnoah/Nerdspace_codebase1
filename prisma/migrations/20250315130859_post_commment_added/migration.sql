-- CreateTable
CREATE TABLE "postcomments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "parentId" TEXT,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "postcomments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "postcomments" ADD CONSTRAINT "postcomments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "postcomments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postcomments" ADD CONSTRAINT "postcomments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "postcomments" ADD CONSTRAINT "postcomments_postId_fkey" FOREIGN KEY ("postId") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
