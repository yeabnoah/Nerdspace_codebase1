"use client";

import LeftNavbar from "@/components/navbar/left-navbar";
import UserList from "@/components/UserList";
import UserListSkeleton from "@/components/UserListSkeleton";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const Whotofollow = () => {
  const session = authClient.useSession();
  const queryClient = useQueryClient();
  const [initialLoading, setInitialLoading] = useState(true);

  // Force prefetch on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Directly fetch data
        const response = await axios.get("/api/user/follow/recommendation");

        // Update query cache with fresh data
        queryClient.setQueryData(["users", null], response.data);

        // Also prefetch to ensure consistent behavior
        queryClient.prefetchQuery({
          queryKey: ["users", null],
          queryFn: async () => response.data,
          staleTime: 0, // Consider fresh immediately
        });
      } catch (error) {
        console.error("Error prefetching user data:", error);
      } finally {
        // Give a small delay to ensure a smooth transition
        setTimeout(() => {
          setInitialLoading(false);
        }, 300);
      }
    };

    fetchData();
  }, [queryClient]);

  const handleFollow = (userId: string) => {
    if (!session.data) {
      toast.error("Please login to follow users");
      return;
    }

    if (session.data?.user.id === userId) {
      toast.error("You cannot follow yourself");
      return;
    }
  };

  return (
    <div className="relative mx-auto flex max-w-6xl flex-1 flex-row items-start">
      {/* Orange diagonal glow from bottom-left to top-right */}
      <div className="absolute -right-4 size-32 -rotate-45 rounded-full border border-blue-300/50 bg-gradient-to-br from-blue-300/40 via-blue-400/50 to-transparent blur-[150px] backdrop-blur-sm"></div>
      <div className="absolute -bottom-5 left-12 size-32 rotate-45 rounded-full border border-orange-300/50 bg-gradient-to-tl from-orange-300/40 via-orange-400/30 to-transparent blur-[150px] backdrop-blur-sm"></div>

      <LeftNavbar />
      <div className="container relative mx-auto max-w-4xl flex-1 px-4 py-8 backdrop-blur-sm">
        <h1 className="mb-6 font-instrument text-3xl">Who to Follow</h1>
        {initialLoading ? <UserListSkeleton /> : <UserList handleFollow={handleFollow} />}
      </div>
    </div>
  );
};

export default Whotofollow;
