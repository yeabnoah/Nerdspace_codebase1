"use client";

import type React from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, MoreHorizontal } from "lucide-react";
import { useState } from "react";
// import { useCommunity } from "@/components/community-provider";
import type { CommunityPost } from "@/lib/types";

interface PostCardProps {
  post: CommunityPost;
}

export function PostCard({ post }: PostCardProps) {
  // const { communities, currentUser, likePost, addComment } = useCommunity();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");

  // Find the user who created the post
  // const community = communities.find((c: any) => c.id === post.communityId);
  // const user = community?.members.find(
  //   (m: any) => m.userId === post.userId,
  // )?.user;

  // // Check if the current user has liked the post
  // const hasLiked = post.likes.some((like) => like.userId === currentUser.id);

  // Format the date
  const formattedDate = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  });

  // Handle like
  const handleLike = () => {
    // likePost(post.id);
  };

  // Handle comment submission
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (commentText.trim()) {
      // addComment(post.id, commentText);
      setCommentText("");
    }
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-start gap-3 space-y-0 pb-2">
        <Avatar className="h-8 w-8">
          {/* <AvatarImage src={user?.image || undefined} /> */}
          <AvatarFallback>
            {/* {user?.name.substring(0, 2).toUpperCase()} */}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              {/* <p className="text-sm font-medium">{user?.name}</p> */}
              <p className="text-xs text-muted-foreground">{formattedDate}</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Report</DropdownMenuItem>
                {/* {post.userId === currentUser.id && (
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                )} */}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-2 pt-1">
        <p className="text-sm">{post.content}</p>
        {post.image && (
          <div className="mt-3 overflow-hidden rounded-md">
            <img
              src={post.image || "/placeholder.svg"}
              alt="Post attachment"
              className="h-auto w-full object-cover"
            />
          </div>
        )}
      </CardContent>

      <CardFooter className="flex flex-col items-start border-t pt-2">
        <div className="flex w-full items-center gap-4">
          {/* <Button
            variant="ghost"
            size="sm"
            className={`flex h-7 items-center gap-1 px-2 ${hasLiked ? "text-primary" : ""}`}
            onClick={handleLike}
          >
            <Heart
              className={`h-3.5 w-3.5 ${hasLiked ? "fill-current" : ""}`}
            />
            <span className="text-xs">{post.likes.length}</span>
          </Button> */}
          <Button
            variant="ghost"
            size="sm"
            className="flex h-7 items-center gap-1 px-2"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageSquare className="h-3.5 w-3.5" />
            <span className="text-xs">{post.comments.length}</span>
          </Button>
        </div>

        {showComments && (
          <div className="mt-3 w-full space-y-3">
            {/* {post.comments.length > 0 && (
              <div className="space-y-2">
                {post.comments.map((comment) => {
                  const commentUser = community?.members.find(
                    (m: any) => m.userId === comment.userId,
                  )?.user;
                  return (
                    <div key={comment.id} className="flex gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={commentUser?.image || undefined} />
                        <AvatarFallback>
                          {commentUser?.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 rounded-md bg-muted p-2">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-medium">
                            {commentUser?.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(comment.createdAt), {
                              addSuffix: true,
                            })}
                          </p>
                        </div>
                        <p className="text-xs">{comment.content}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )} */}

            <form
              onSubmit={handleCommentSubmit}
              className="flex flex-col gap-2"
            >
              <Textarea
                placeholder="Write a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="min-h-[60px] text-sm"
              />
              <Button type="submit" size="sm" className="self-end">
                Post
              </Button>
            </form>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
