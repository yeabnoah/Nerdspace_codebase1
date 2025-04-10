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
    <div className="container mx-auto my-5 max-w-4xl px-4 sm:px-6 lg:px-8">
      <h1 className="mb-5 text-center font-instrument text-3xl sm:text-left">
        Who to Follow 
      </h1>
      <div className="rounded-lg">
        <div className="space-y-4">
          {users.length > 0 ? (
            users.map((u) => (
              <div
                key={u.id}
                className="flex flex-col items-center justify-between py-1 sm:flex-row"
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={u.image || "/user.jpg"}
                    alt="user"
                    className="size-10 rounded-full"
                    height={200}
                    width={200}
                  />
                  <div className="flex flex-col text-center sm:text-left">
                    <span className="font-semibold">{u.visualName}</span>
                    <span className="text-sm text-gray-500">
                      Nerd@{u.nerdAt}
                    </span>
                  </div>
                </div>
                <Button
                  variant={"outline"}
                  className="mt-2 border bg-transparent shadow-none sm:mt-0"
                  onClick={() => handleFollowClick(u.id)}
                  disabled={followLoading[u.id]}
                >
                  {followLoading[u.id] ? "Loading..." : u.isFollowingAuthor ? "Following" : "Follow"}
                </Button>
              </div>
            ))
          ) : (
            <p className="text-center text-sm text-gray-500">
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
