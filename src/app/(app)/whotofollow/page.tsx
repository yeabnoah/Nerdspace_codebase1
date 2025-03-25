"use client";

import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import LeftNavbar from "@/components/navbar/left-navbar";
import UserList from "@/components/UserList";
import UserListSkeleton from "@/components/UserListSkeleton";

const Whotofollow = () => {
  const queryClient = useQueryClient();
  const session = authClient.useSession();
  const router = useRouter();

  const handleFollow = (userId: string) => {
    if (session.data?.user.id === userId) {
      toast.error("You cannot follow yourself");
      return;
    }
  };

  return (
    <div className="mx-auto flex max-w-6xl flex-1 flex-row items-start">
      <LeftNavbar />
      <UserList handleFollow={handleFollow} />
    </div>
  );
};

export default Whotofollow;
