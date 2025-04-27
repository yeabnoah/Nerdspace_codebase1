"use client";

import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  bio: string | null;
  nerdAt: string;
  coverImage: string | null;
}

interface Pagination {
  nextCursor: string | null;
  hasNextPage: boolean;
  total: number;
}

interface FollowersFollowingListProps {
  userId: string;
  type: "followers" | "following";
}

export default function FollowersFollowingList({
  userId,
  type,
}: FollowersFollowingListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    nextCursor: null,
    hasNextPage: false,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
    {},
  );
  const session = useSession();
  const queryClient = useQueryClient();

  const fetchData = async (cursor?: string) => {
    try {
      const url = new URL(
        `/api/users/${userId}/${type}`,
        window.location.origin,
      );
      if (cursor) {
        url.searchParams.append("cursor", cursor);
      }
      url.searchParams.append("limit", "10");

      const response = await fetch(url.toString());
      const data = await response.json();

      if (cursor) {
        setUsers((prev) => [...prev, ...data.data]);
      } else {
        setUsers(data.data);
      }
      setPagination(data.pagination);
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userId, type, fetchData]);

  const { data: followStatus } = useQuery({
    queryKey: ["follow-status", users.map((u) => u.id).join(",")],
    queryFn: async () => {
      if (users.length === 0) return {};
      const response = await axios.get(
        `/api/users/check-follow?userIds=${users.map((u) => u.id).join(",")}`,
      );
      return response.data;
    },
    enabled: users.length > 0,
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
        `/api/user/follow`,
        { followingId: userId },
        { params: { action } }
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

  const loadMore = () => {
    if (pagination.nextCursor) {
      setLoadingMore(true);
      fetchData(pagination.nextCursor);
    }
  };

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="group relative overflow-hidden rounded-2xl border-none bg-gradient-to-br from-zinc-100 via-white to-zinc-50  transition-all duration-300 hover:scale-[1.02] dark:from-zinc-900 dark:via-zinc-800/10 dark:to-black"
          >
            {/* Content container */}
            <div className="relative z-10 flex items-center justify-between gap-4 p-3">
              <Link
                href={`/profile/${user.id}`}
                className="flex flex-1 items-center gap-4"
              >
                <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-white dark:ring-zinc-800">
                  <Image
                    src={user.image || "/user.jpg"}
                    alt={user.name}
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

      {pagination.hasNextPage && (
        <div className="flex justify-center">
          <Button variant="outline" onClick={loadMore} disabled={loadingMore}>
            {loadingMore ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Load More"
            )}
          </Button>
        </div>
      )}

      {users.length === 0 && (
        <div className="text-center text-muted-foreground">No {type} found</div>
      )}
    </div>
  );
}
