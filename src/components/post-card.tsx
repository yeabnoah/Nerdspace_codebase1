"use client";

import { motion } from "framer-motion";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Bookmark, Heart, MessageSquare, MoreHorizontal } from "lucide-react";
import { useState } from "react";
// import { useCommunity } from "@/components/community-provider";
import { FollowButton } from "@/components/follow-button";
import { Input } from "@/components/ui/input";
import type { CommunityPost } from "@/lib/types";
import Image from "next/image";

interface PostComment {
  id: string;
  content: string;
  user: {
    id: string;
    name: string;
    image: string;
  };
}

interface PostCardProps {
  post: CommunityPost;
  currentUser: {
    id: string;
    name: string;
    image: string;
  };
}

export function PostCard({ post, currentUser }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(
    Array.isArray(post.likes) ? post.likes.length : 0,
  );
  const [comments, setComments] = useState<PostComment[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");

  // Find the user who created the post
  // const community = communities.find((c: any) => c.id === post.communityId);
  // const user = community?.members.find(
  //   (m: any) => m.userId === post.userId,
  // )?.user;

  // // Check if the current user has liked the post
  // const hasLiked = post.likes.some((like) => like.userId === currentUser.id);

  // Format the date
  // const formattedDate = formatDistanceToNow(new Date(post.createdAt), {
  //   addSuffix: true,
  // });

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: currentUser.id }),
      });

      if (response.ok) {
        setIsLiked(!isLiked);
        setLikes((prev) => (isLiked ? prev - 1 : prev + 1));
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleComment = async () => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`/api/posts/${post.id}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newComment,
          userId: currentUser.id,
        }),
      });

      if (response.ok) {
        const comment = await response.json();
        setComments((prev) => [...prev, comment]);
        setNewComment("");
      }
    } catch (error) {
      console.error("Error adding comment:", error);
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
      <Card className="mx-auto mb-4 w-full max-w-2xl">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar>
            <AvatarImage src={post.user.image} alt={post.user.name} />
            <AvatarFallback>{post.user.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{post.user.name}</p>
                <p className="text-sm text-gray-500">@{post.user.username}</p>
              </div>
              {currentUser && currentUser.id !== post.user.id && (
                <FollowButton
                  userId={currentUser.id}
                  isFollowing={post.user.isFollowing || false}
                />
              )}
              <div className="flex items-center gap-2">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="cursor-pointer"
                >
                  <Heart className="h-4 w-4 text-muted-foreground transition-colors hover:text-red-500" />
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                  className="cursor-pointer"
                >
                  <Bookmark className="h-4 w-4 text-muted-foreground transition-colors hover:text-yellow-500" />
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
            {post.content.split(/(\s+)/).map((word, i) =>
              word.startsWith("#") ? (
                <span key={i} className="text-purple-500">
                  {word}
                </span>
              ) : (
                word
              ),
            )}
          </motion.p>
          {post.image && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-3 overflow-hidden rounded-md"
            >
              <Image
                fill
                src={post.image || "/placeholder.svg"}
                alt="Post attachment"
                className="h-auto w-full object-cover"
              />
            </motion.div>
          )}
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className="flex items-center gap-2"
            >
              <Heart
                className={`h-4 w-4 ${
                  isLiked ? "fill-red-500 text-red-500" : ""
                }`}
              />
              <span>{likes}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowComments(!showComments)}
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              <span>{comments.length}</span>
            </Button>
          </div>
          {showComments && (
            <div className="w-full space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <Button onClick={handleComment}>Comment</Button>
              </div>
              <div className="space-y-2">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage
                        src={comment.user.image}
                        alt={comment.user.name}
                      />
                      <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">{comment.user.name}</p>
                      <p className="text-sm text-gray-600">{comment.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
}
