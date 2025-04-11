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
import FollowListSkeleton from "./FollowListSkeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

  if (isLoading) return <FollowListSkeleton />;
  if (isError) return <p>Error loading users</p>;

  const users: UserInterface[] = data?.data || [];
  const nextCursor: string | null = data?.nextCursor || null;

  return (
    <Card className="hidden min-h-32 w-64 rounded-2xl border border-gray-100 bg-transparent pt-4 shadow-none dark:border-gray-500/5 md:block">
      <div className="relative">
        <div className="absolute -right-4 size-32 -rotate-45 rounded-full border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent blur-[150px] backdrop-blur-sm"></div>

        <h2
          onClick={() => {
            router.push("/whotofollow");
          }}
          className="mb-3 px-6 font-instrument text-2xl italic text-card-foreground hover:cursor-pointer hover:underline dark:text-white"
        >
          Who to Follow
        </h2>
        <CardContent className="flex flex-col space-y-3 px-2">
          {users.length > 0 ? (
            users.map((u) => (
              <div
                key={u.id}
                className="group relative flex flex-row items-center gap-3 rounded-xl border border-gray-100/50 bg-gray-500/5 p-2 transition-all duration-300 dark:border-gray-500/5"
              >
                <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-white/10">
                  <Image
                    src={u.image || "/user.jpg"}
                    alt="user"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    height={200}
                    width={200}
                  />
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-center justify-between">
                    <p
                      className="text-xs font-medium hover:underline"
                      title={u.visualName ?? ""}
                    >
                      {(u.visualName && u.visualName.length > 6
                        ? u.visualName.slice(0, 6) + "..."
                        : u.visualName) ||
                        (u.name && u.name.length > 6
                          ? u.name.slice(0, 6) + "..."
                          : u.name) ||
                        ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    Nerd@
                    {u.nerdAt && u.nerdAt.length > 6
                      ? u.nerdAt.slice(0, 4) + "..."
                      : u.nerdAt}
                  </div>
                </div>
                <Button
                  size="sm"
                  className="rounded-full border bg-transparent text-card-foreground shadow-none hover:bg-transparent dark:text-white"
                  onClick={() => handleFollow(u.id)}
                >
                  Follow
                </Button>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No suggestions available</p>
          )}
        </CardContent>
        {nextCursor && (
          <div className="px-6 pb-4">
            <Button
              onClick={() => setCursor(nextCursor)}
              className="w-full rounded-full border bg-transparent text-card-foreground shadow-none hover:bg-transparent dark:text-white"
            >
              Load More
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default FollowList;
