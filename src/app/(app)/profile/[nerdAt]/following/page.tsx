"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import UserProfile from "@/components/settings/user-profile";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";

export default function FollowingPage() {
  const params = useParams();
  if (!params?.nerdAt) return null;
  const nerdAt = params.nerdAt as string;

  const { data: following, isLoading } = useQuery({
    queryKey: ["user-following", nerdAt],
    queryFn: async () => {
      const response = await axios.get(`/api/users/${nerdAt}/following`);
      return response.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="mx-auto min-h-screen w-full px-4 md:w-[70%] md:px-8">
        <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4 rounded-lg border p-4">
              <Skeleton className="size-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen w-full px-4 md:w-[70%] md:px-8">
      <h1 className="mb-6 text-2xl font-bold">Following</h1>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {following?.map((user: any) => (
          <Link
            key={user.id}
            href={`/app/profile/${user.nerdAt}`}
            className="flex items-center space-x-4 rounded-lg border p-4 hover:bg-accent"
          >
            <div className="relative size-12 overflow-hidden rounded-full">
              <Image
                src={user.image || "/user.jpg"}
                alt={user.name}
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium">{user.visualName || user.name}</h3>
              <p className="text-sm text-muted-foreground">Nerd@{user.nerdAt}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
} 