"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown, ChevronUp } from "lucide-react";
import CommentForm from "./comment-form";
import { CommunityInterface } from "@/interface/auth/community.interface";

interface PostCommentsProps {
  post: CommunityInterface["posts"][0];
  communityId: string;
  user: {
    id: string;
    name?: string;
    image?: string;
  };
}

export default function PostComments({
  post,
  communityId,
  user,
}: PostCommentsProps) {
  const [showComments, setShowComments] = useState(false);

  if (!post.comments || post.comments.length === 0) {
    return (
      <div className="mt-4">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground"
          onClick={() => setShowComments(!showComments)}
        >
          Be the first to comment
        </Button>
        {showComments && (
          <CommentForm postId={post.id} communityId={communityId} user={user} />
        )}
      </div>
    );
  }

  return (
    <div className="mt-4">
      <Button
        variant="ghost"
        size="sm"
        className="flex items-center gap-1 text-muted-foreground"
        onClick={() => setShowComments(!showComments)}
      >
        {showComments ? (
          <>
            <ChevronUp className="h-4 w-4" />
            Hide {post.comments.length} comments
          </>
        ) : (
          <>
            <ChevronDown className="h-4 w-4" />
            Show {post.comments.length} comments
          </>
        )}
      </Button>

      {showComments && (
        <div className="mt-4 space-y-4">
          {post.comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={comment.user?.image || ""}
                  alt={comment.user?.name || ""}
                />
                <AvatarFallback>
                  {comment.user?.name?.substring(0, 2).toUpperCase() || "UN"}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {comment.user?.name || "Unknown User"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm">{comment.content}</p>
              </div>
            </div>
          ))}

          <CommentForm postId={post.id} communityId={communityId} user={user} />
        </div>
      )}
    </div>
  );
}
