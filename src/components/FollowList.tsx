"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Dot, Users } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  bio: string;
  nerdAt: string;
  coverImage: string;
}

interface FollowListProps {
  type: "followers" | "following";
}

export default function FollowList({ type }: FollowListProps) {
  const params = useParams();
  const userId = params?.userId as string;

  const { data, isLoading } = useQuery({
    queryKey: [`fetch_${type}`, userId],
    queryFn: async () => {
      const response = await axios.get(`/api/users/${userId}/${type}`);
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex items-center gap-2">
        <Users className="h-5 w-5" />
        <h1 className="text-2xl font-semibold">
          {type === "followers" ? "Followers" : "Following"}
        </h1>
        <span className="text-muted-foreground">
          ({data?.pagination?.total || 0})
        </span>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data?.data?.map((user: User) => (
          <Card key={user.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full ring-2 ring-white/20">
                  <Image
                    src={user.image || "/user.jpg"}
                    alt={user.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <Link
                    href={`/profile/${user.id}`}
                    className="font-medium hover:underline"
                  >
                    {user.name}
                  </Link>
                  <div className="flex items-center gap-1">
                    <p className="text-sm text-muted-foreground">
                      Nerd@{user.nerdAt}
                    </p>
                    {user.bio && (
                      <>
                        <Dot className="h-4 w-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          {user.bio.length > 20
                            ? `${user.bio.substring(0, 20)}...`
                            : user.bio}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
} 