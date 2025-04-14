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
import toast from "react-hot-toast";

const Follower = () => {
  const queryClient = useQueryClient();
  const session = authClient.useSession();

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["followers"],
    queryFn: async ({ pageParam = null }) => {
      const { data } = await axios.get(`/api/users/followers`, {
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
    mutationFn: async (userId: string) => {
      const response = await axios.post(`/api/user/follow?userId=${userId}`);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["followers"] });
      queryClient.invalidateQueries({ queryKey: ["follow-status"] });
      if (typeof data.message === "string") {
        toast.success(data.message);
      }
    },
  });

  const { data: followStatus } = useQuery({
    queryKey: ["follow-status"],
    queryFn: async () => {
      const statuses = await Promise.all(
        followers.map(async (follower) => {
          const { data } = await axios.get(
            `/api/users/check-follow?userId=${follower.id}`,
          );
          return { userId: follower.id, isFollowing: data.isFollowing };
        }),
      );
      return statuses;
    },
    // enabled: followers.length > 0,
  });

  const handleFollow = (userId: string) => {
    if (session.data?.user.id === userId) {
      toast.error("You cannot follow yourself");
      return;
    }
    followMutation.mutate(userId);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Followers</h1>
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
        <p className="text-red-500">Error loading followers</p>
      </div>
    );
  }

  const followers = data?.pages.flatMap((page) => page.data) || [];

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 font-instrument text-3xl">Followers</h1>
      <div className="space-y-4">
        {followers.length > 0 ? (
          followers.map((follower) => {
            const isFollowing = followStatus?.find(
              (status) => status.userId === follower.id,
            )?.isFollowing;

            return (
              <div
                key={follower.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 overflow-hidden rounded-full">
                    <Image
                      src={follower.image || "/user.jpg"}
                      alt={follower.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      {follower.visualName || follower.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Nerd@{follower.nerdAt}
                    </p>
                  </div>
                </div>
                {session.data?.user.id !== follower.id && (
                  <Button
                    variant="outline"
                    onClick={() => handleFollow(follower.id)}
                    className="rounded-lg bg-transparent px-2 py-1 text-xs shadow-none hover:bg-transparent md:text-sm"
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                )}
              </div>
            );
          })
        ) : (
          <p className="text-center text-muted-foreground">No followers yet</p>
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

export default Follower;
