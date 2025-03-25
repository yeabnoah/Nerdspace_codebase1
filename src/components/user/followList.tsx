"use client";

import { useState } from "react";
import UserInterface from "@/interface/auth/user.interface";
import { Button } from "../ui/button";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const FollowList = () => {
  const [cursor, setCursor] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const session = authClient.useSession();
  const router = useRouter();

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
      const response = await axios.post(`/api/user/follow?userId=${userId}`);
      return response.data.message;
    },
    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success(message);
    },
  });

  const handleFollow = (userId: string) => {
    if (session.data?.user.id === userId) {
      toast.error("You cannot follow yourself");
      return;
    }
    followMutation.mutate(userId);
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading users</p>;

  const users: UserInterface[] = data?.data || [];
  const nextCursor: string | null = data?.nextCursor || null;

  return (
    <div className="my-5 hidden gap-2 rounded-xl border border-gray-100 px-4 py-5 shadow-none dark:border-gray-500/5 md:flex md:flex-col lg:w-[19vw]">
      <div>
        <h1
          className="font-instrument text-2xl italic hover:cursor-pointer hover:underline"
          onClick={() => {
            router.push("/whotofollow");
          }}
        >
          Who to Follow
        </h1>
        <div className="space-y-3">
          {users.length > 0 ? (
            users.map((u) => (
              <div
                key={u.id}
                className="my-5 flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <Image
                    src={u.image || "/user.jpg"}
                    alt="user"
                    className="size-10 rounded-full"
                    height={200}
                    width={200}
                  />
                  <div className="flex flex-col items-start">
                    <span className="text-sm">{u.visualName}</span>
                    <span className="text-[12px]">Nerd@{u.nerdAt}</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="border bg-transparent text-card-foreground shadow-none hover:bg-transparent dark:text-white"
                  onClick={() => handleFollow(u.id)}
                >
                  Follow
                </Button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No suggestions available</p>
          )}
        </div>
        {nextCursor && (
          <Button onClick={() => setCursor(nextCursor)} className="mt-4">
            Load More
          </Button>
        )}
      </div>
    </div>
  );
};

export default FollowList;
