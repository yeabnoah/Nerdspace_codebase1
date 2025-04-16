"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { PlusIcon } from "lucide-react";
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
      const response = await axios.post(`/api/user/follow?userId=${userId}&action=${action}`);
      return response.data;
    },
    onMutate: async (action) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["follow-status", userId] });
      await queryClient.cancelQueries({ queryKey: ["user-data", userId] });

      // Snapshot the previous value
      const previousStatus = queryClient.getQueryData(["follow-status", userId]);
      const previousUserData = queryClient.getQueryData(["user-data", userId]);

      // Optimistically update to the new value
      queryClient.setQueryData(["follow-status", userId], (old: any) => ({
        ...old,
        [userId]: action === "follow",
      }));

      // Optimistically update user data
      if (previousUserData) {
        queryClient.setQueryData(["user-data", userId], (old: any) => ({
          ...old,
          _count: {
            ...old._count,
            followers: action === "follow" ? old._count.followers + 1 : old._count.followers - 1,
          },
        }));
      }

      return { previousStatus, previousUserData };
    },
    onError: (err, action, context) => {
      // Revert back to the previous value on error
      if (context?.previousStatus) {
        queryClient.setQueryData(["follow-status", userId], context.previousStatus);
      }
      if (context?.previousUserData) {
        queryClient.setQueryData(["user-data", userId], context.previousUserData);
      }
      const errorMessage = err || "Error occurred while following/unfollowing user";
      toast.error(errorMessage);
    },
    onSettled: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["follow-status", userId] });
      queryClient.invalidateQueries({ queryKey: ["user-data", userId] });
      queryClient.invalidateQueries({ queryKey: ["followers"] });
      queryClient.invalidateQueries({ queryKey: ["following"] });
    },
  });

  const handleFollow = () => {
    if (!session?.data?.user?.email) {
      toast.error("Please sign in to follow users");
      return;
    }
    
    if (followMutation.isPending) return;
    
    followMutation.mutate(isFollowing ? "unfollow" : "follow");
  };

  if (isCurrentUser || !session?.data?.user?.email) {
    return null;
  }

    return (
      <Button
        className="h-7 rounded-2xl px-4 transition-all duration-300 hover:scale-105"
        variant={isFollowing ? "outline" : "default"}
        size="sm"
        onClick={handleFollow}
        disabled={followMutation.isPending}
      >
        {followMutation.isPending ? (
          "Loading..."
        ) : isFollowing ? (
          "Following"
        ) : (
          <div className="flex items-center gap-2">
            <PlusIcon className="h-4 w-4" />
            <span>Follow</span>
          </div>
        )}
      </Button>
    );
  }
