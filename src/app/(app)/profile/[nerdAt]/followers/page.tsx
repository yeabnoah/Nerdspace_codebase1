"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import UserFollowers from "@/components/settings/user-followers";
import { Skeleton } from "@/components/ui/skeleton";
import LeftNavbar from "@/components/navbar/left-navbar";
import MobileNavBar from "@/components/navbar/mobile-nav-bar";

export default function UserFollowersPage() {
  const params = useParams();
  if (!params?.nerdAt) return null;

  const nerdAt = params.nerdAt as string;

  const {
    data: userData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["user-profile", nerdAt],
    queryFn: async () => {
      const { data } = await axios.get(`/api/user?nerdAt=${nerdAt}`);
      return data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="mx-auto min-h-screen w-full px-4 md:w-[70%] md:px-8">
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="size-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-10 w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="mx-auto min-h-screen w-full px-4 md:w-[70%] md:px-8">
        <div className="flex h-[50vh] items-center justify-center">
          <p className="text-red-500">
            Error loading user data. Please try again.
          </p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="mx-auto min-h-screen w-full px-4 md:w-[70%] md:px-8">
        <div className="flex h-[50vh] items-center justify-center">
          <p className="text-muted-foreground">User not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-1 flex-row items-start">
      <LeftNavbar />
      <div className="my-5 flex min-h-fit flex-1 flex-row items-start px-[.3px]">
        <UserFollowers nerdAt={nerdAt} />
      </div>

      <MobileNavBar />
    </div>
  );
}
