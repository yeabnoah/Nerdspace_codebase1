"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { Heart, MessageSquare, MoreHorizontal, Trash } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface UpdateProps {
  id: string;
  title: string;
  image: string;
  content: string;
  projectId: string;
  createdAt: string;
  userId: string;
  initialLikes?: number;
  initialComments?: number;
}

export default function UpdateCard({
  update,
  initialLikes = 0,
  initialComments = 0,
  isOwner,
}: {
  update: UpdateProps;
  initialLikes?: number;
  initialComments?: number;
  isOwner: boolean;
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(false);

  const queryClient = useQueryClient();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/project/update/${id}`);
    },
    onSuccess: () => {
      toast.success("Update deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["project"] }); // Invalidate project query
    },
    onError: () => {
      toast.error("Failed to delete update. Please try again.");
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(update.id);
  };

  // Format the date to be more readable
  const formattedDate = formatDistanceToNow(new Date(update.createdAt), {
    addSuffix: true,
  });

  // Get user initials for avatar fallback
  const userInitials = update.userId.substring(0, 2).toUpperCase();

  const handleLike = () => {
    if (liked) {
      setLikes(likes - 1);
    } else {
      setLikes(likes + 1);
    }
    setLiked(!liked);
  };

  return (
    <TooltipProvider>
      <Card className="my-2 overflow-hidden rounded-lg border border-gray-100 bg-card dark:border-gray-500/5">
        <div className="flex items-start">
          <CardContent className="flex-1 border-none bg-transparent p-3">
            <div className="relative my-2 h-44 shrink-0 border-r border-border bg-transparent">
              <Image
                src={update.image || "/placeholder.svg"}
                alt={update.title}
                width={1000}
                height={1000}
                className="h-full w-full rounded-lg object-cover grayscale"
                priority
              />
            </div>
            <div className="mb-2 flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage
                    src={`https://avatar.vercel.sh/${update.userId}`}
                  />
                  <AvatarFallback className="text-[10px]">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <h3 className="line-clamp-1 text-sm font-medium">
                  {update.title}
                </h3>
                <Badge variant="outline" className="h-4 px-1 text-[10px]">
                  v1.0
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <span className="text-xs">{formattedDate}</span>
                {isOwner && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive"
                    onClick={handleDelete}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </div>
            </div>

            <p className="mb-2 line-clamp-2 text-xs text-muted-foreground">
              {update.content}
            </p>

            <div className="mt-2 flex items-center justify-between border-t border-border/50 pt-1">
              <div className="flex items-center gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 gap-1 px-2 text-xs"
                      onClick={handleLike}
                    >
                      <Heart
                        className={`h-3 w-3 ${liked ? "fill-destructive text-destructive" : ""}`}
                      />
                      <span>{likes > 0 ? likes : "Like"}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-xs">Like this update</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 gap-1 px-2 text-xs"
                    >
                      <MessageSquare className="h-3 w-3" />
                      <span>
                        {initialComments > 0 ? initialComments : "Comment"}
                      </span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-xs">Comment on this update</p>
                  </TooltipContent>
                </Tooltip>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">
                  ID: {update.id.substring(0, 6)}
                </span>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </TooltipProvider>
  );
}
