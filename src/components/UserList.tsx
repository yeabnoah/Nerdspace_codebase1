"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import UserInterface from "@/interface/auth/user.interface";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import UserListSkeleton from "@/components/UserListSkeleton";
import { UserPlus, Users } from "lucide-react";

interface UserListProps {
  handleFollow?: (userId: string) => void;
}

interface ApiResponse {
  data: UserInterface[];
  nextCursor: string | null;
  message?: string;
}

const UserList: React.FC<UserListProps> = ({ handleFollow }) => {
  const [cursor, setCursor] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const session = authClient.useSession();
  const [followLoading, setFollowLoading] = useState<Record<string, boolean>>(
    {},
  );
  const [isTransitioning, setIsTransitioning] = useState(false);

  const { data, isLoading, isError, error, refetch } = useQuery<ApiResponse>({
    queryKey: ["users", cursor],
    queryFn: async () => {
      try {
        const response = await axios.get<ApiResponse>(
          `/api/user/follow/recommendation?cursor=${cursor}`,
        );
        return response.data;
      } catch (err) {
        console.error("Error fetching users:", err);
        throw err;
      }
    },
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 3,
    refetchOnReconnect: true,
    initialData: { data: [], nextCursor: null },
  });

  const followMutation = useMutation({
    mutationFn: async (userId: string) => {
      try {
        setFollowLoading((prev) => ({ ...prev, [userId]: true }));
        const response = await axios.post(`/api/user/follow`, {
          followingId: userId,
        });
        return response.data.message;
      } catch (err) {
        console.error("Error following user:", err);
        throw err;
      }
    },
    onSuccess: (message, userId) => {
      handleFollow?.(userId);

      // Update the cache immediately
      queryClient.setQueryData(["users", cursor], (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          data: oldData.data.filter(
            (user: UserInterface) => user.id !== userId,
          ),
        };
      });

      // Show skeleton loader during transition
      setIsTransitioning(true);

      // Fetch fresh data - but don't invalidate the current cache
      setTimeout(() => {
        // Only refetch if we've removed too many items
        const currentData = queryClient.getQueryData(["users", cursor]) as
          | ApiResponse
          | undefined;
        if (!currentData || currentData.data.length < 4) {
          refetch().then(() => {
            setIsTransitioning(false);
          });
        } else {
          setIsTransitioning(false);
        }
      }, 300);

      toast.success(message || "Successfully followed user");
    },
    onError: (error) => {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error occurred while following/unfollowing user";
      toast.error(errorMessage);
      setIsTransitioning(false);
    },
    onSettled: (_, __, variables) => {
      setFollowLoading((prev) => ({ ...prev, [variables]: false }));
    },
  });

  // Periodically refresh the list if empty
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (data && data.data.length === 0 && !isLoading) {
      timer = setTimeout(() => {
        setIsTransitioning(true);
        refetch().finally(() => setIsTransitioning(false));
      }, 3000);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [data, isLoading, refetch]);

  const handleFollowClick = (userId: string) => {
    if (!session.data) {
      toast.error("Please login to follow users");
      return;
    }

    if (session.data?.user.id === userId) {
      toast.error("You cannot follow yourself");
      return;
    }

    followMutation.mutate(userId);
  };

  if (isLoading || isTransitioning) return <UserListSkeleton />;

  if (isError) {
    console.error("Error loading users:", error);
    return (
      <div className="text-center text-red-500">
        Error loading users. Please try again later.
      </div>
    );
  }

  const users: UserInterface[] = data?.data || [];
  const nextCursor: string | null = data?.nextCursor || null;

  // If no users, show skeleton instead of empty message
  if (users.length === 0) {
    return (
      <div className="space-y-4">
        <UserListSkeleton />
        <p className="mt-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
          {data?.message || "Looking for recommendations..."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <div
            key={user.id}
            className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-gray-500/10 dark:bg-black/80"
          >
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-3 h-20 w-20">
                <div className="h-full w-full overflow-hidden rounded-full border-2 border-zinc-200 dark:border-zinc-700">
                  <Image
                    src={user.image || "/user.jpg"}
                    alt={user.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
              </div>

              <h3 className="mb-1 text-lg font-semibold text-zinc-900 dark:text-white">
                {user.visualName || user.name}
              </h3>

              <p className="mb-3 text-sm text-zinc-500 dark:text-zinc-400">
                Nerd@
                {user.nerdAt || user.name.toLowerCase().replace(/\s+/g, "")}
              </p>

              <div className="mb-4 flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                <div>
                  <span className="font-semibold">
                    {user?._count?.following || 0}
                  </span>{" "}
                  Following
                </div>
                <div>
                  <span className="font-semibold">
                    {user?._count?.followers || 0}
                  </span>{" "}
                  Followers
                </div>
              </div>

              <Button
                variant={user.isFollowingAuthor ? "secondary" : "default"}
                className="w-full gap-2 rounded-full"
                onClick={() => handleFollowClick(user.id)}
                disabled={followLoading[user.id]}
              >
                {followLoading[user.id] ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Loading...
                  </span>
                ) : user.isFollowingAuthor ? (
                  <>
                    <Users className="h-4 w-4" />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Follow
                  </>
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {nextCursor && (
        <Button
          onClick={() => setCursor(nextCursor)}
          className="mt-6 w-full rounded-full bg-zinc-100 py-6 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
        >
          Load More
        </Button>
      )}
    </div>
  );
};

export default UserList;
