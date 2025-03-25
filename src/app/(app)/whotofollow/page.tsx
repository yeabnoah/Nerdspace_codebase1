"use client";

import React, { useState } from "react";
import UserInterface from "@/interface/auth/user.interface";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import LeftNavbar from "@/components/navbar/left-navbar";

const Whotofollow = () => {
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
    <div className="mx-auto flex max-w-6xl flex-1 flex-row items-start">
      <LeftNavbar />
      <div className="container mx-auto my-5 max-w-4xl">
        <h1 className="mb-5 font-instrument text-3xl">Who to Follow</h1>
        <div className="rounded-lg bg-white p-5">
          <div className="space-y-4">
            {users.length > 0 ? (
              users.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between border-b border-gray-200 p-4"
                >
                  <div className="flex items-center gap-4">
                    <Image
                      src={u.image || "/user.jpg"}
                      alt="user"
                      className="size-10 rounded-full"
                      height={200}
                      width={200}
                    />
                    <div className="flex flex-col">
                      <span className="font-semibold">{u.visualName}</span>
                      <span className="text-sm text-gray-500">
                        Nerd@{u.nerdAt}
                      </span>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="border bg-transparent text-blue-500 shadow-none hover:bg-blue-50"
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
            <Button
              onClick={() => setCursor(nextCursor)}
              className="mt-4 w-full"
            >
              Load More
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Whotofollow;
