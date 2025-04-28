"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "@/lib/auth-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function UserFollowersPage() {
  const params = useParams();
  const userId = params?.userId as string;
  const session = useSession();
  const queryClient = useQueryClient();
  const [loadingUserId, setLoadingUserId] = useState<string | null>(null);

  const { data: response, isLoading } = useQuery({
    queryKey: ["user-followers", userId],
    queryFn: async () => {
      if (!userId) return { data: [] };
      const response = await axios.get(`/api/users/${userId}/followers`);
      return response.data;
    },
    enabled: !!userId,
  });

  const followers = response?.data || [];

  const { data: followStatus } = useQuery({
    queryKey: [
      "follow-status",
      followers.map((f: { id: string }) => f.id).join(","),
    ],
    queryFn: async () => {
      if (followers.length === 0) return {};
      const response = await axios.get(
        `/api/users/check-follow?userIds=${followers.map((f: { id: string }) => f.id).join(",")}`,
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
      setLoadingUserId(userId);
      const response = await axios.post(
        `/api/user/follow`,
        { followingId: userId },
        { params: { action } },
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["followers"] });
      queryClient.invalidateQueries({ queryKey: ["following"] });
      queryClient.invalidateQueries({ queryKey: ["follow-status"] });
      toast.success(data.message);
      setLoadingUserId(null);
    },
    onError: () => {
      toast.error("Error occurred while following/unfollowing user");
      setLoadingUserId(null);
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

  if (!userId) return null;

  if (isLoading) {
    return (
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
    );
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-1 flex-row items-start">
      <div className="mx-10 my-5 flex min-h-fit flex-1 flex-row items-start px-[.3px]">
        <div className="container mx-auto py-6">
          <h1 className="mb-6 font-instrument text-3xl">Followers</h1>
          <div className="grid gap-4">
            {followers.map((follower: any) => (
              <div
                key={follower.id}
                className="group relative overflow-hidden rounded-2xl border-none bg-gradient-to-br from-zinc-100 via-white to-zinc-50 transition-all duration-300 dark:from-zinc-900 dark:via-zinc-800/10 dark:to-black"
              >
                <div className="relative z-10 flex items-center justify-between gap-4 p-3">
                  <Link
                    href={`/user-profile/${follower.id}`}
                    className="flex flex-1 items-center gap-4"
                  >
                    <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-white dark:ring-zinc-800">
                      <Image
                        src={follower.image || "/user.jpg"}
                        alt={follower.name}
                        fill
                        className="object-cover transition-all duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div>
                      <h3 className="font-heading font-geist text-sm font-semibold text-zinc-900 dark:text-white">
                        {follower.name}
                      </h3>
                      <p className="font-geist text-sm text-zinc-500 dark:text-zinc-400">
                        @{follower.nerdAt}
                      </p>
                    </div>
                  </Link>
                  {session.data?.user.id !== follower.id && (
                    <Button
                      onClick={() => handleFollow(follower.id)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 ${
                        followStatus?.[follower.id]
                          ? "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:border dark:border-gray-500/10 dark:bg-black dark:text-zinc-100"
                          : "bg-black text-white dark:bg-white dark:text-black"
                      } mx-4`}
                      disabled={loadingUserId === follower.id}
                    >
                      {loadingUserId === follower.id
                        ? "Loading..."
                        : followStatus?.[follower.id]
                          ? "Following"
                          : "Follow"}
                    </Button>
                  )}
                </div>
              </div>
            ))}
            {followers.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-zinc-100 via-white to-zinc-50 p-12 dark:from-zinc-900 dark:via-zinc-800/10 dark:to-black">
                <Users className="h-12 w-12 text-zinc-400 dark:text-zinc-600" />
                <p className="mt-4 font-geist text-lg text-zinc-500 dark:text-zinc-400">
                  No followers yet
                </p>
                <p className="font-geist text-sm text-zinc-400 dark:text-zinc-500">
                  When someone follows you, they&apos;ll appear here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
