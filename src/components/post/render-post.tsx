
import { useState } from "react";
import { timeAgo } from "@/functions/calculate-time-difference";
import usePostStore from "@/store/post.store";
import { BookmarkIcon, Heart, MessageCircle } from "lucide-react";
import Image from "next/image";

const RenderPOst = () => {
  const { posts, fetchPostLoading } = usePostStore();
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (fetchPostLoading) {
    return (
      <div className="h-[60vh] flex justify-center items-center w-full">
        loading ..
      </div>
    );
  }

  return (
    <div>
      {posts.map((each, index) => {
       
        
        // Trim content to 20 words
        const contentWords = each.content.split(" ");
        const truncatedContent = contentWords.slice(0, 20).join(" ");
        const isLongContent = contentWords.length > 20;

        return (
          <div className="my-5 rounded-xl border p-4" key={index}>
            <div className="flex items-center gap-5">
              <Image
                src={each.user.image}
                alt="user"
                className="size-10 rounded-full"
                height={200}
                width={200}
              />

              <div>
                <h1 className="text-sm">{each.user.name}</h1>
                <h1 className="text-xs">{timeAgo(each.createdAt)}</h1>
              </div>
            </div>

            <div className="mt-2 flex items-start justify-center">
              <div className="flex-1">
                <h4 className="text-balance text-sm">
                  {isExpanded || !isLongContent
                    ? each.content
                    : `${truncatedContent}...`}
                </h4>
                {isLongContent && (
                  <button
                    className="text-blue-500 text-xs mt-2"
                    onClick={() => setIsExpanded((prev) => !prev)}
                  >
                    {isExpanded ? "See less" : "See more"}
                  </button>
                )}
              </div>

              <div className="flex flex-col gap-5">
                <div className="rounded-full px-2">
                  <Heart />
                </div>
                <div className="rounded-full px-2">
                  <MessageCircle />
                </div>
                <div className="rounded-full px-2">
                  <BookmarkIcon />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RenderPOst;
