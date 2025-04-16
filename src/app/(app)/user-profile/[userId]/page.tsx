"use client";

import LeftNavbar from "@/components/navbar/left-navbar";
import MobileNavBar from "@/components/navbar/mobile-nav-bar";
import UserProfile from "@/components/settings/user-profile";
import { Skeleton } from "@/components/ui/skeleton";
import UserInterface from "@/interface/auth/user.interface";
import useUserProfileStore from "@/store/userProfile.store";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Page({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const [userId, setUserId] = useState<string | null>(null);
  const { setUserProfile } = useUserProfileStore();

  useEffect(() => {
    const fetchParams = async () => {
      const resolvedParams = await params;
      setUserId(resolvedParams.userId);
    };
    fetchParams();
  }, [params]);

  // Use React Query to fetch user data
  const { isLoading } = useQuery<UserInterface>({
    queryKey: ["user-fetch", userId],
    queryFn: async () => {
      if (!userId) return null;
      const response = await axios.get(`/api/user?userId=${userId}`);
      setUserProfile(response.data.data);
      return response.data.data;
    },
    enabled: !!userId,
  });

  // const load = true

  if (!userId) {
    return (
      <div className="mx-auto flex max-w-6xl flex-1 flex-row items-start justify-center">
        <div className="mx-auto min-h-screen w-[70%] px-4 sm:px-6 lg:px-8">
          <div className="relative h-40 overflow-hidden rounded-xl border">
            <Skeleton className="h-full w-full" />
          </div>
          <div className="relative px-6 pb-6">
            <div className="-mt-16 flex flex-col">
              <div className="relative">
                <Skeleton className="size-24 rounded-full" />
              </div>
              <Skeleton className="mb-2 mt-2 h-10 w-1/2" />
              {/* <Skeleton className="h-4 w-1/3" /> */}
              <Skeleton className="mb-4 h-4 w-3/4" />
            </div>
          </div>
          <div className="px-6 pb-20">
            <Skeleton className="h-10 w-full" />
            <div className="mt-4">
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-6xl flex-1 flex-row items-start justify-center">
        <div className="mx-auto min-h-screen w-[70%] px-4 sm:px-6 lg:px-8">
          <div className="relative h-40 overflow-hidden rounded-xl border">
            <Skeleton className="h-full w-full" />
          </div>
          <div className="relative px-6 pb-6">
            <div className="-mt-16 flex flex-col">
              <div className="relative">
                <Skeleton className="size-24 rounded-full" />
              </div>
              <Skeleton className="mb-2 mt-2 h-10 w-1/2" />
              {/* <Skeleton className="h-4 w-1/3" /> */}
              <Skeleton className="mb-4 h-4 w-3/4" />
            </div>
          </div>
          <div className="px-6 pb-20">
            <Skeleton className="h-10 w-full" />
            <div className="mt-4">
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex flex-1 flex-row items-start justify-center md:max-w-6xl">
      {/* <LeftNavbar /> */}
      <UserProfile />
      {/* <MobileNavBar /> */}
    </div>
  );
}
