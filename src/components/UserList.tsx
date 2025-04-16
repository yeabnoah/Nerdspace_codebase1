import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import UserInterface from "@/interface/auth/user.interface";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import UserListSkeleton from "@/components/UserListSkeleton";
import { ExternalLink, Users, UserPlus, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UserListProps {
  handleFollow: (userId: string) => void;
}

const UserList: React.FC<UserListProps> = ({ handleFollow }) => {
  const [cursor, setCursor] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const session = authClient.useSession();
  const [followLoading, setFollowLoading] = useState<Record<string, boolean>>(
    {},
  );

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
    <div className="container relative mx-auto my-5 max-w-4xl px-4 sm:px-6 lg:px-8">
      <div className="absolute -right-10 -top-20 hidden h-[300px] w-[300px] -rotate-45 rounded-full bg-gradient-to-br from-amber-300/10 to-transparent blur-[80px] dark:from-orange-300/10 md:block"></div>

      <h1 className="mb-5 text-center font-instrument text-3xl sm:text-left">
        Who to Follow
      </h1>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {users.length > 0 ? (
          users.map((u) => (
            <Card
              key={u.id}
              className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:border-zinc-300 hover:shadow-lg dark:border-zinc-800 dark:bg-black dark:border-gray-500/5"
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
                    <p className="truncate text-sm text-zinc-500 dark:text-zinc-400">
                      Nerd@{u?.nerdAt || u.username}
                    </p>
                  </div>
                </div>

                {u.bio && (
                  <p className="mt-3 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-300">
                    {u.bio}
                  </p>
                )}

               

                <Button
                  variant={u.isFollowingAuthor ? "secondary" : "default"}
                  className="mt-4 py-5 rounded-full w-full gap-2 transition-all"
                  onClick={() => handleFollowClick(u.id)}
                  disabled={followLoading[u.id]}
                >
                  {followLoading[u.id] ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      Loading...
                    </span>
                  ) : u.isFollowingAuthor ? (
                    "Following"
                  ) : (
                    "Follow"
                  )}
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-500/5 dark:bg-card/50">
              <CardContent className="flex flex-col items-center justify-center rounded-xl bg-white py-12 text-center dark:bg-card/50">
                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/10 to-indigo-500/10">
                  <Users className="h-10 w-10 text-indigo-500" />
                </div>
                <h3 className="mb-2 text-xl font-normal text-gray-900 dark:text-gray-100">
                  No suggestions available
                </h3>
                <p className="max-w-md text-gray-500 dark:text-gray-400">
                  We couldn't find any users to suggest at the moment. Check
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
          className="mt-6 w-full bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
        >
          Load More
        </Button>
      )}
    </div>
  );
};

export default UserList;
