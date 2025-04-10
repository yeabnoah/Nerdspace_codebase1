"use client";

import type React from "react";
import { motion, AnimatePresence } from "framer-motion";

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
import { MessageSquare, MoreHorizontal, Bookmark, Heart } from "lucide-react";
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.01 }}
      className="overflow-hidden"
    >
      <Card>
        <CardHeader className="flex flex-row items-start gap-3 space-y-0 pb-2">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Avatar className="h-8 w-8">
              {/* <AvatarImage src={user?.image || undefined} /> */}
              <AvatarFallback>
                {/* {user?.name.substring(0, 2).toUpperCase()} */}
              </AvatarFallback>
            </Avatar>
          </motion.div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                {/* <p className="text-sm font-medium">{user?.name}</p> */}
                <p className="text-xs text-muted-foreground">{formattedDate}</p>
              </div>
              <div className="flex items-center gap-2">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="cursor-pointer"
                >
                  <Heart className="h-4 w-4 text-muted-foreground hover:text-red-500 transition-colors" />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                  className="cursor-pointer"
                >
                  <Bookmark className="h-4 w-4 text-muted-foreground hover:text-yellow-500 transition-colors" />
                </motion.div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.div
                      whileHover={{ rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">More options</span>
                      </Button>
                    </motion.div>
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
          </div>
        </CardHeader>

        <CardContent className="pb-2 pt-1">
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm"
          >
            {post.content}
          </motion.p>
          {post.image && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-3 overflow-hidden rounded-md"
            >
              <img
                src={post.image || "/placeholder.svg"}
                alt="Post attachment"
                className="h-auto w-full object-cover"
              />
            </motion.div>
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
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="flex items-center"
            >
              <Button
                variant="ghost"
                size="sm"
                className="flex h-7 items-center gap-1 px-2"
                onClick={() => setShowComments(!showComments)}
              >
                <motion.div
                  animate={{ 
                    scale: showComments ? [1, 1.2, 1] : 1,
                    rotate: showComments ? [0, 10, -10, 0] : 0
                  }}
                  transition={{ 
                    duration: 0.5,
                    times: [0, 0.3, 0.6, 1]
                  }}
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                </motion.div>
                <motion.span
                  animate={{ 
                    scale: showComments ? [1, 1.1, 1] : 1
                  }}
                  transition={{ duration: 0.3 }}
                  className="text-xs"
                >
                  {post.comments.length}
                </motion.span>
              </Button>
            </motion.div>
          </div>

          <AnimatePresence>
            {showComments && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-3 w-full space-y-3"
              >
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
                  <motion.div 
                    whileHover={{ scale: 1.02 }} 
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button type="submit" size="sm" className="self-end">
                      Post
                    </Button>
                  </motion.div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
