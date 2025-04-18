import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import UserInterface from "@/interface/auth/user.interface";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import UserListSkeleton from "@/components/UserListSkeleton";
import { ExternalLink, Users, UserPlus, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UserListProps {
  handleFollow: (userId: string) => void;
}

const UserList: React.FC<UserListProps> = ({ handleFollow }) => {
  const [cursor, setCursor] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const session = authClient.useSession();
  const [followLoading, setFollowLoading] = useState<Record<string, boolean>>({});

  const { data, isLoading, isError } = useQuery({
    queryKey: ["users", cursor],
    queryFn: async () => {
      const response = await axios.get(
        `/api/user/follow/recommendation?curosr=${cursor}`,
      );
      return response.data;
    },
  });

  const followMutation = useMutation({
    mutationKey: ["follow-user"],
    mutationFn: async (userId: string) => {
      setFollowLoading((prev) => ({ ...prev, [userId]: true }));
      const response = await axios.post(`/api/user/follow?userId=${userId}`);
      return response.data.message;
    },
    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["who-to-follow"] });
      queryClient.invalidateQueries({ queryKey: ["follow-status"] });
      queryClient.invalidateQueries({ queryKey: ["user-followers"] });
      queryClient.invalidateQueries({ queryKey: ["user-following"] });
      queryClient.invalidateQueries({ queryKey: ["explore"] });
      toast.success(message);
    },
    onError: () => {
      toast.error("Error occurred while following/unfollowing user");
    },
    onSettled: (_, __, variables) => {
      setFollowLoading((prev) => ({ ...prev, [variables]: false }));
    },
  });

  const handleFollowClick = (userId: string) => {
    if (session.data?.user.id === userId) {
      toast.error("You cannot follow yourself");
      return;
    }
    followMutation.mutate(userId);
  };

  if (isLoading) return <UserListSkeleton />;
  if (isError) return <p>Error loading users</p>;

  const users: UserInterface[] = data?.data || [];
  const nextCursor: string | null = data?.nextCursor || null;

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {users.length > 0 ? (
          users.map((u) => (
            <Card
              key={u.id}
              className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white/80 shadow-sm transition-all duration-300 hover:border-zinc-300 hover:shadow-lg dark:border-zinc-800/50 dark:bg-black/80 dark:hover:border-zinc-700/50 backdrop-blur-sm"
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="relative h-16 w-16 overflow-hidden rounded-full ring-2 ring-white/20">
                      <Image
                        src={u.image || "/user.jpg"}
                        alt="user"
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-heading truncate text-lg font-semibold text-zinc-900 dark:text-white">
                      {u?.visualName || u.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">
                        Nerd@{u?.nerdAt || u.username}
                      </p>
                    </div>
                  </div>
                </div>

                {u.bio && (
                  <p className="mt-3 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-300">
                    {u.bio}
                  </p>
                )}

                <Button
                  variant={u.isFollowingAuthor ? "secondary" : "default"}
                  className="mt-4 w-full gap-2 rounded-full py-5 transition-all hover:bg-primary/90 dark:hover:bg-primary/80"
                  onClick={() => handleFollowClick(u.id)}
                  disabled={followLoading[u.id]}
                >
                  {followLoading[u.id] ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Loading...
                    </span>
                  ) : u.isFollowingAuthor ? (
                    <>
                      <Users className="h-4 w-4" />
                      Following
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-4 w-4" />
                      Follow
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card className="overflow-hidden rounded-xl border border-gray-100 bg-white/80 shadow-sm backdrop-blur-sm dark:border-gray-500/5 dark:bg-black/80">
              <CardContent className="flex flex-col items-center justify-center rounded-xl py-12 text-center">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/10 to-indigo-500/10">
                  <Users className="h-10 w-10 text-indigo-500" />
                </div>
                <h3 className="mb-2 text-xl font-normal text-gray-900 dark:text-gray-100">
                  No suggestions available
                </h3>
                <p className="max-w-md text-gray-500 dark:text-gray-400">
                  We couldn&apos;t find any users to suggest at the moment. Check
                  back later for new recommendations.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {nextCursor && (
        <Button
          onClick={() => setCursor(nextCursor)}
          className="mt-6 w-full rounded-full bg-zinc-100 py-6 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
        >
          Load More
        </Button>
      )}
    </div>
  );
};

export default UserList;
