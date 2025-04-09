"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface UserFollowersProps {
  nerdAt: string;
}

const UserFollowers = ({ nerdAt }: UserFollowersProps) => {
  const queryClient = useQueryClient();
  const session = authClient.useSession();
  const router = useRouter();

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["user-followers", nerdAt],
    queryFn: async ({ pageParam = null }) => {
      const { data } = await axios.get(`/api/users/${nerdAt}/followers`, {
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
    mutationFn: async (followUserId: string) => {
      const response = await axios.post(`/api/user/follow?userId=${followUserId}`);
      return response.data.message;
    },
    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: ["user-followers", nerdAt] });
      toast.success(message);
    },
  });

  const handleFollow = (followUserId: string) => {
    if (session.data?.user.id === followUserId) {
      toast.error("You cannot follow yourself");
      return;
    }
    followMutation.mutate(followUserId);
  };

  const followers = data?.pages.flatMap((page) => page.data) || [];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex items-center justify-between rounded-lg border p-4"
          >
            <div className="flex items-center gap-4">
              <Skeleton className="size-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <Skeleton className="h-10 w-24" />
          </div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">
        Error loading followers. Please try again.
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 font-instrument text-3xl">Followers</h1>
      <div className="space-y-4">
        {followers.length > 0 ? (
          followers.map((user: any) => (
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
                <Button variant="outline" onClick={() => handleFollow(user.id)}>
                  Follow
                </Button>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground">
            No followers yet
          </p>
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

export default UserFollowers; 