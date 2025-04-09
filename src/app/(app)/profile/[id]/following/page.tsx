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
                className="flex items-center justify-between gap-4 rounded-lg p-4 transition-colors"
              >
                <Link
                  href={`/profile/${user.id}`}
                  className="flex flex-1 items-center gap-4"
                >
                  <div className="relative h-12 w-12 overflow-hidden rounded-full">
                    <Image
                      src={user.image || "/default-avatar.png"}
                      alt={user.name || "User"}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-semibold">{user.name}</h3>
                    <p className="text-sm text-muted-foreground">
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
                  >
                    {loadingStates[user.id]
                      ? "Loading..."
                      : followStatus?.[user.id]
                        ? "Following"
                        : "Follow"}
                  </Button>
                )}
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
