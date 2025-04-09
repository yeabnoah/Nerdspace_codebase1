"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";

interface FollowButtonProps {
  userId: string;
  isCurrentUser: boolean;
  isFollowing: boolean;
}

export default function FollowButton({
  userId,
  isCurrentUser,
  isFollowing,
}: FollowButtonProps) {
  const session = useSession();
  const queryClient = useQueryClient();

  const followMutation = useMutation({
    mutationFn: async (action: "follow" | "unfollow") => {
      if (action === "follow") {
        const response = await axios.post(`/api/users/follow`, {
          userId,
        });
        return response.data;
      } else {
        const response = await axios.post(`/api/users/unfollow`, {
          userId,
        });
        return response.data;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["followers"] });
      toast.success(
        isFollowing
          ? "Successfully unfollowed user"
          : "Successfully followed user",
      );
    },
    onError: () => {
      toast.error("Error occurred while following/unfollowing user");
    },
  });

  const handleFollow = () => {
    if (!session?.data?.user?.email) {
      toast.error("Please sign in to follow users");
      return;
    }
    followMutation.mutate(isFollowing ? "unfollow" : "follow");
  };

  if (isCurrentUser || !session?.data?.user?.email) {
    return null;
  }

  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      size="sm"
      onClick={handleFollow}
      disabled={followMutation.isPending}
    >
      {followMutation.isPending
        ? "Loading..."
        : isFollowing
          ? "Following"
          : "Follow"}
    </Button>
  );
}
