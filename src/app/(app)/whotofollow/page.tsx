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
import UserList from "@/components/UserList";
import UserListSkeleton from "@/components/UserListSkeleton";

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

  if (isLoading) return <UserListSkeleton />;
  if (isError) return <p>Error loading users</p>;

  const users: UserInterface[] = data?.data || [];
  const nextCursor: string | null = data?.nextCursor || null;

  return (
    <div className="mx-auto flex max-w-6xl flex-1 flex-row items-start">
      <LeftNavbar />
      <UserList
        users={users}
        nextCursor={nextCursor}
        handleFollow={handleFollow}
        setCursor={setCursor}
      />
    </div>
  );
};

export default Whotofollow;
