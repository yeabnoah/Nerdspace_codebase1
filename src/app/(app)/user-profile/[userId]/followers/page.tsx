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

export default function UserFollowersPage() {
  const params = useParams();
  const userId = params?.userId as string;
  const session = useSession();
  const queryClient = useQueryClient();

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
    queryKey: ["follow-status", followers.map((f: { id: string }) => f.id).join(",")],
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
      <div className="container mx-auto max-w-4xl p-4">
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <Users className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Followers</h2>
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
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
    <div className="container mx-auto max-w-4xl p-4">
      <Card className="rounded-xl border-none shadow-none">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center gap-2">
            <h2 className="font-instrument text-3xl">Followers</h2>
          </div>
          <div className="space-y-4">
            {followers.map((follower: any) => (
              <div key={follower.id} className="flex items-center justify-between rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                <Link
                  href={`/user-profile/${follower.id}`}
                  className="flex items-center gap-4 flex-1"
                >
                  <div className="relative h-12 w-12 overflow-hidden rounded-full">
                    <Image
                      src={follower.image || "/user.jpg"}
                      alt={follower.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{follower.name}</h3>
                    <p className="text-sm text-gray-500">@{follower.nerdAt}</p>
                  </div>
                </Link>
                {session.data?.user.id !== follower.id && (
                  <button
                    onClick={() => handleFollow(follower.id)}
                    className={`rounded-full px-4 py-2 text-sm font-medium ${
                      followStatus?.[follower.id]
                        ? "bg-gray-100 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700"
                        : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                    disabled={followMutation.isPending}
                  >
                    {followMutation.isPending
                      ? "Loading..."
                      : followStatus?.[follower.id]
                        ? "Following"
                        : "Follow"}
                  </button>
                )}
              </div>
            ))}
            {followers.length === 0 && (
              <p className="text-center text-gray-500">No followers yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
