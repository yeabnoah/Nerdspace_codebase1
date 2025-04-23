"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "@/lib/auth-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function UserFollowingPage() {
  const params = useParams();
  const userId = params?.userId as string;
  const session = useSession();
  const queryClient = useQueryClient();

  const { data: response, isLoading } = useQuery({
    queryKey: ["user-following", userId],
    queryFn: async () => {
      if (!userId) return { data: [] };
      const response = await axios.get(`/api/users/${userId}/following`);
      return response.data;
    },
    enabled: !!userId,
  });

  const following = response?.data || [];

  const { data: followStatus } = useQuery({
    queryKey: [
      "follow-status",
      following.map((f: { id: string }) => f.id).join(","),
    ],
    queryFn: async () => {
      if (following.length === 0) return {};
      const response = await axios.get(
        `/api/users/check-follow?userIds=${following.map((f: { id: string }) => f.id).join(",")}`,
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
      const response = await axios.post(
        `/api/user/follow`,
        { followingId: userId },
        { params: { action } }
      );
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["following"] });
      queryClient.invalidateQueries({ queryKey: ["followers"] });
      queryClient.invalidateQueries({ queryKey: ["follow-status"] });
      toast.success(data.message);
    },
    onError: () => {
      toast.error("Error occurred while following/unfollowing user");
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
              <h1 className="mb-6 font-instrument text-3xl">Following</h1>
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 rounded-2xl bg-black/5 dark:bg-gray-400/5 p-2"
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
          <h1 className="mb-6 font-instrument text-3xl">Following</h1>
          <div className="grid gap-4">
            {following.map((followed: any) => (
              <div
                key={followed.id}
                className="group relative overflow-hidden rounded-2xl border-none bg-gradient-to-br from-zinc-100 via-white to-zinc-50 transition-all duration-300 dark:from-zinc-900 dark:via-zinc-800/10 dark:to-black"
              >
                <div className="relative z-10 flex items-center justify-between gap-4 p-3">
                  <Link
                    href={`/user-profile/${followed.id}`}
                    className="flex flex-1 items-center gap-4"
                  >
                    <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-white dark:ring-zinc-800">
                      <Image
                        src={followed.image || "/user.jpg"}
                        alt={followed.name}
                        fill
                        className="object-cover transition-all duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div>
                      <h3 className="font-heading font-geist text-sm font-semibold text-zinc-900 dark:text-white">
                        {followed.name}
                      </h3>
                      <p className="font-geist text-sm text-zinc-500 dark:text-zinc-400">
                        @{followed.nerdAt}
                      </p>
                    </div>
                  </Link>
                  {session.data?.user.id !== followed.id && (
                    <button
                      onClick={() => handleFollow(followed.id)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-105 ${
                        followStatus?.[followed.id]
                          ? "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:border dark:border-gray-500/10 dark:bg-black dark:text-zinc-100"
                          : "bg-black text-white dark:bg-white dark:text-black"
                      } mx-4`}
                      disabled={followMutation.isPending}
                    >
                      {followMutation.isPending
                        ? "Loading..."
                        : followStatus?.[followed.id]
                          ? "Following"
                          : "Follow"}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {following.length === 0 && (
              <div className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-zinc-100 via-white to-zinc-50 p-12 dark:from-zinc-900 dark:via-zinc-800/10 dark:to-black">
                <Users className="h-12 w-12 text-zinc-400 dark:text-zinc-600" />
                <p className="mt-4 font-geist text-lg text-zinc-500 dark:text-zinc-400">
                  Not following anyone yet
                </p>
                <p className="font-geist text-sm text-zinc-400 dark:text-zinc-500">
                  When you follow someone, they&apos;ll appear here
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
