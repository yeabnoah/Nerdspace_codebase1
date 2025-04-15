import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import UserInterface from "@/interface/auth/user.interface";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import UserListSkeleton from "@/components/UserListSkeleton";

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
    <div className="container mx-auto my-5 max-w-4xl px-4 sm:px-6 lg:px-8">
      <h1 className="mb-5 text-center font-instrument text-3xl sm:text-left">
        Who to Follow
      </h1>
      <div className="rounded-lg">
        <div className="flex items-center flex-wrap gap-10">
          {users.length > 0 ? (
            users.map((u) => (
              <div
                key={u.id}
                className="group w-fit relative overflow-hidden rounded-2xl border-none bg-gradient-to-br from-zinc-100 via-white to-zinc-50 shadow-md transition-all duration-300 hover:scale-[1.02] dark:from-zinc-900 dark:via-zinc-800/10 dark:to-black"
              >
                <div className="relative z-10 flex flex-col p-6">
                  <div className="flex items-center gap-4">
                    <Image
                      src={u.image || "/user.jpg"}
                      alt="user"
                      className="h-16 w-16 rounded-full ring-2 ring-white dark:ring-zinc-800"
                      height={64}
                      width={64}
                    />
                    <div>
                      <h3 className="font-heading text-lg font-semibold text-zinc-900 dark:text-white">
                        {u.visualName}
                      </h3>
                      <p className="text-sm text-zinc-500 dark:text-zinc-400">
                        Nerd@{u.nerdAt}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant={"outline"}
                    className="mt-6 w-full gap-2 bg-transparent text-black shadow-none transition-all hover:bg-transparent dark:text-white"
                    onClick={() => handleFollowClick(u.id)}
                    disabled={followLoading[u.id]}
                  >
                    {followLoading[u.id]
                      ? "Loading..."
                      : u.isFollowingAuthor
                        ? "Following"
                        : "Follow"}
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center my-5 font-geist text-sm text-gray-500">
              No suggestions available
            </p>
          )}
        </div>
        {nextCursor && (
          <Button onClick={() => setCursor(nextCursor)} className="mt-4 w-full">
            Load More
          </Button>
        )}
      </div>
    </div>
  );
};

export default UserList;
