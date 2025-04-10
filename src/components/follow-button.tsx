"use client";

import { Button } from "@/components/ui/button";
import { followService } from "@/functions/follow";
import { useState } from "react";
import { toast } from "sonner";

interface FollowButtonProps {
  userId: string;
  isFollowing: boolean;
  onFollowChange?: (isFollowing: boolean) => void;
}

export function FollowButton({ userId, isFollowing, onFollowChange }: FollowButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleFollow = async () => {
    try {
      setIsLoading(true);
      const action = isFollowing ? "unfollow" : "follow";
      await followService.followUser(userId, action);
      onFollowChange?.(!isFollowing);
      toast.success(`Successfully ${action}ed user`);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("already following")) {
          // If we're already following, try to unfollow instead
          await followService.followUser(userId, "unfollow");
          onFollowChange?.(false);
          toast.success("Successfully unfollowed user");
          return;
        }
        toast.error(error.message);
      } else {
        toast.error("Failed to follow user");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      size="sm"
      onClick={handleFollow}
      disabled={isLoading}
    >
      {isLoading ? "Loading..." : isFollowing ? "Following" : "Follow"}
    </Button>
  );
} 