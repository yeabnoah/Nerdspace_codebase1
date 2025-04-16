"use client";

import LeftNavbar from "@/components/navbar/left-navbar";
import MobileNavBar from "@/components/navbar/mobile-nav-bar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { FollowResponse, followService } from "@/functions/follow";
import { authClient } from "@/lib/auth-client";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useInView } from "react-intersection-observer";

const FollowersPage = () => {
  const { ref, inView } = useInView();
  const queryClient = useQueryClient();
  const session = authClient.useSession();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {},
  );

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<FollowResponse>({
      queryKey: ["followers"],
      queryFn: ({ pageParam }) =>
        followService.getFollowers(pageParam as string | undefined),
      getNextPageParam: (lastPage) => lastPage.pagination.nextCursor,
      initialPageParam: undefined,
    });

  const followers =
    data?.pages.flatMap((page: FollowResponse) => page.data) || [];

  const { data: followStatus, isLoading: isLoadingFollowStatus } = useQuery({
    queryKey: ["follow-status", followers.map((f) => f.id).join(",")],
    queryFn: async () => {
      if (followers.length === 0) return {};
      const response = await axios.get(
        `/api/users/check-follow?userIds=${followers.map((f) => f.id).join(",")}`,
      );
      return response.data;
    },
    enabled: followers.length > 0,
  });

  const followMutation = useMutation({
    mutationFn: async ({
      userId,
      action,
    }: {
      userId: string;
      action: "follow" | "unfollow";
    }) => {
      setLoadingStates((prev) => ({ ...prev, [userId]: true }));
      const response = await axios.post(
        `/api/user/follow?userId=${userId}&action=${action}`,
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["followers"] });
      queryClient.invalidateQueries({ queryKey: ["following"] });
      queryClient.invalidateQueries({ queryKey: ["follow-status"] });
      toast.success(data.message);
    },
    onError: () => {
      toast.error("Error occurred while following/unfollowing user");
    },
    onSettled: (_, __, variables) => {
      setLoadingStates((prev) => ({ ...prev, [variables.userId]: false }));
    },
  });

  const handleFollow = (userId: string) => {
    if (session.data?.user.id === userId) {
      toast.error("You cannot follow yourself");
      return;
    }
    const isFollowing = followStatus?.[userId];
    followMutation.mutate({
      userId,
      action: isFollowing ? "unfollow" : "follow",
    });
  };

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoadingFollowStatus) {
    return (
      <div className="mx-auto flex max-w-6xl flex-1 flex-row items-start">
        <LeftNavbar />
        <div className="container mx-auto max-w-4xl bg-transparent p-4">
          <Card className="border-none shadow-none dark:bg-black">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <h1 className="mb-6 font-instrument text-3xl">Followers</h1>
              </div>
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 rounded-2xl bg-black/5 p-2 dark:bg-gray-400/5"
                  >
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
        <MobileNavBar />
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-1 flex-row items-start">
      <LeftNavbar />
      <div className="mx-10 my-5 flex min-h-fit flex-1 flex-row items-start px-[.3px]">
        <div className="container mx-auto py-6">
          <h1 className="mb-6 font-instrument text-3xl">Followers</h1>
          <div className="grid gap-4">
            {followers.map((user) => (
              <div
                key={user.id}
                className="group relative overflow-hidden rounded-2xl border-none bg-gradient-to-br from-zinc-100 via-white to-zinc-50 transition-all duration-300 dark:from-zinc-900 dark:via-zinc-800/10 dark:to-black"
              >
                <div className="relative z-10 flex items-center justify-between gap-4 p-3">
                  <Link
                    href={`/user-profile/${user.id}`}
                    className="flex flex-1 items-center gap-4"
                  >
                    <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-white dark:ring-zinc-800">
                      <Image
                        src={user.image || "/default-avatar.png"}
                        alt={user.name || "User"}
                        fill
                        className="object-cover transition-all duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div>
                      <h3 className="font-heading font-geist text-sm font-semibold text-zinc-900 dark:text-white">
                        {user.name}
                      </h3>
                      <p className="font-geist text-sm text-zinc-500 dark:text-zinc-400">
                        {user.bio || "No bio yet"}
                      </p>
                    </div>
                  </Link>
                  {session.data?.user.id !== user.id && (
                    <Button
                      variant={followStatus?.[user.id] ? "outline" : "default"}
                      size="sm"
                      onClick={() => handleFollow(user.id)}
                      disabled={loadingStates[user.id]}
                      className={`h-10 rounded-full px-4 transition-all duration-300 hover:scale-105 ${
                        followStatus?.[user.id]
                          ? "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:border dark:border-gray-500/10 dark:bg-black dark:text-zinc-100"
                          : "bg-black text-white dark:bg-white dark:text-black"
                      } mx-4`}
                    >
                      <span className="px-2 font-geist text-sm font-normal">
                        {loadingStates[user.id]
                          ? "Loading..."
                          : followStatus?.[user.id]
                            ? "Following"
                            : "Follow"}
                      </span>
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div ref={ref} className="h-4" />
          {isFetchingNextPage && (
            <div className="py-4 text-center font-geist text-sm text-zinc-500 dark:text-zinc-400">
              Loading more...
            </div>
          )}
        </div>
      </div>
      <MobileNavBar />
    </div>
  );
};

export default FollowersPage;
