"use client";

import LeftNavbar from "@/components/navbar/left-navbar";
import MobileNavBar from "@/components/navbar/mobile-nav-bar";
import { FollowResponse, followService } from "@/functions/follow";
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import axios from "axios";

const FollowingPage = ({ params }: { params: { id: string } }) => {
  const { ref, inView } = useInView();
  const queryClient = useQueryClient();
  const session = authClient.useSession();
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {},
  );

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery<FollowResponse>({
      queryKey: ["following"],
      queryFn: ({ pageParam }) =>
        followService.getFollowing(pageParam as string | undefined),
      getNextPageParam: (lastPage) => lastPage.pagination.nextCursor,
      initialPageParam: undefined,
    });

  const following =
    data?.pages.flatMap((page: FollowResponse) => page.data) || [];

  const { data: followStatus } = useQuery({
    queryKey: ["follow-status", following.map((f) => f.id).join(",")],
    queryFn: async () => {
      if (following.length === 0) return {};
      const response = await axios.get(
        `/api/users/check-follow?userIds=${following.map((f) => f.id).join(",")}`,
      );
      return response.data;
    },
    enabled: following.length > 0,
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
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["following"] });
      queryClient.invalidateQueries({ queryKey: ["followers"] });
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

  return (
    <div className="mx-auto flex max-w-6xl flex-1 flex-row items-start">
      <LeftNavbar />
      <div className="my-5 flex min-h-fit flex-1 flex-row items-start px-[.3px]">
        <div className="container mx-10 py-6">
          <h1 className="mb-6 font-instrument text-3xl">Following</h1>
          <div className="grid gap-4">
            {following.map((user) => (
              <div
                key={user.id}
                className="group relative overflow-hidden rounded-2xl border-none bg-gradient-to-br from-zinc-100 via-white to-zinc-50  transition-all duration-300 dark:from-zinc-900 dark:via-zinc-800/10 dark:to-black"
              >
               
                <div className="relative z-10 flex items-center justify-between gap-4 p-3">
                  <Link
                    href={`/profile/${user.id}`}
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
                      <h3 className="font-heading text-sm font-geist font-semibold text-zinc-900 dark:text-white">
                        {user.name}
                      </h3>
                      <p className="text-sm text-zinc-500 font-geist dark:text-zinc-400">
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
                      className="h-10 rounded-full px-4 transition-all duration-300 hover:scale-105"
                    >
                      <span className="font-geist text-sm font-normal px-2">
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
            <div className="py-4 text-center">Loading more...</div>
          )}
        </div>
      </div>
      <MobileNavBar />
    </div>
  );
};

export default FollowingPage;
