"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const Following = () => {
  const [cursor, setCursor] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const session = authClient.useSession();
  const params = useParams();
  const userId = params?.userId as string;

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["following", userId],
    queryFn: async ({ pageParam = null }) => {
      const { data } = await axios.get(`/api/users/${userId}/following`, {
        params: { cursor: pageParam },
      });
      return data;
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) =>
      lastPage?.pagination?.nextCursor ?? undefined,
  });

  const followMutation = useMutation({
    mutationKey: ["follow-user"],
    mutationFn: async (followingId: string) => {
      const response = await axios.post(`/api/user/follow?userId=${followingId}`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["following", userId] });
      queryClient.invalidateQueries({ queryKey: ["follow-status", userId] });
      if (typeof data.message === "string") {
        toast.success(data.message);
      }
    },
  });

  const { data: followStatus } = useQuery({
    queryKey: ["follow-status", userId],
    queryFn: async () => {
      const following = data?.pages.flatMap((page) => page.data) || [];
      const statuses = await Promise.all(
        following.map(async (user) => {
          const { data } = await axios.get(
            `/api/users/check-follow?userId=${user.id}`,
          );
          return { userId: user.id, isFollowing: data.isFollowing };
        }),
      );
      return statuses;
    },
  });

  const handleFollow = (followingId: string) => {
    if (session.data?.user.id === followingId) {
      toast.error("You cannot follow yourself");
      return;
    }
    followMutation.mutate(followingId);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Following</h1>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-9 w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <p className="text-red-500">Error loading following</p>
      </div>
    );
  }

  const following = data?.pages.flatMap((page) => page.data) || [];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 font-instrument text-3xl">Following</h1>
      <div className="space-y-4">
        {following.length > 0 ? (
          following.map((user: any) => {
            const isFollowing = followStatus?.find(
              (status) => status.userId === user.id,
            )?.isFollowing;

            return (
              <div
                key={user.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full">
                    <Image
                      src={user.image || "/user.jpg"}
                      alt={user.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {user.visualName || user.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Nerd@{user.nerdAt}
                    </p>
                  </div>
                </div>
                {session.data?.user.id !== user.id && (
                  <Button
                    variant="outline"
                    onClick={() => handleFollow(user.id)}
                    className="rounded-lg bg-transparent px-2 py-1 text-xs shadow-none hover:bg-transparent md:text-sm"
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-center text-muted-foreground">Not following anyone yet</p>
        )}
      </div>
      {hasNextPage && (
        <div className="mt-6 text-center">
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Following;
