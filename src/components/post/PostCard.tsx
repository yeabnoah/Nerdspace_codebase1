"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, MessageSquare, Star } from "lucide-react";
import Image from "next/image";

const PostCard = ({
  post,
  onLike,
  onBookmark,
  onFollow,
  onCommentToggle,
  onMediaClick,
}: {
  post: any;
  onLike?: (postId: string) => void;
  onBookmark?: (postId: string) => void;
  onFollow?: (post: any) => void;
  onCommentToggle?: (postId: string) => void;
  onMediaClick?: (index: number, images: string[]) => void;
}) => {
  const handleMediaClick = (index: number) => {
    if (onMediaClick) {
      onMediaClick(index, post.media.map((media: any) => media.url));
    }
  };

  return (
    <Card className="overflow-hidden border border-gray-100 p-4 dark:border-gray-500/5">
      <div className="flex items-center gap-3 pb-4">
        {post.user?.image && (
          <Image
            src={post.user.image}
            alt={post.user.name || "User"}
            width={40}
            height={40}
            className="rounded-full"
          />
        )}
        <div>
          <p className="text-sm font-medium">{post.user?.name}</p>
          <p className="text-xs text-muted-foreground">@{post.user?.nerdAt}</p>
        </div>
      </div>
      <div className="mb-4">
        <p className="text-sm">{post.content}</p>
      </div>
      {post.media?.length > 0 && (
        <div className="grid gap-2">
          {post.media.map((media: any, index: number) => (
            <div
              key={media.id}
              className="relative h-[20vh] md:h-[28vh]"
              onClick={() => handleMediaClick(index)}
            >
              <Image
                fill
                src={media.url}
                alt="Post media"
                className="h-full w-full rounded-xl object-cover"
              />
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between pt-4">
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => onLike && onLike(post.id)}
        >
          <Heart className="h-4 w-4" />
          <span className="text-xs">{post.likes?.length || 0}</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => onCommentToggle && onCommentToggle(post.id)}
        >
          <MessageSquare className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex items-center gap-1"
          onClick={() => onBookmark && onBookmark(post.id)}
        >
          <Star className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
};

export default PostCard;
