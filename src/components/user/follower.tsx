"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const Follower = () => {
  const [cursor, setCursor] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const session = authClient.useSession();
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["followers", cursor],
    queryFn: async () => {
      const response = await axios.get(`/api/users/followers?cursor=${cursor}`);
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
      queryClient.invalidateQueries({ queryKey: ["followers"] });
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

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">Followers</h1>
        <div className="space-y-4">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="h-9 w-24" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <p className="text-red-500">Error loading followers</p>
      </div>
    );
  }

  const followers = data?.data || [];
  const nextCursor = data?.pagination?.nextCursor;

  return (
    <div className="container mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Followers</h1>
      <div className="space-y-4">
        {followers.length > 0 ? (
          followers.map((follower: any) => (
            <div key={follower.id} className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-4">
                <div className="relative h-12 w-12 overflow-hidden rounded-full">
                  <Image
                    src={follower.image || "/user.jpg"}
                    alt={follower.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold">{follower.visualName || follower.name}</h3>
                  <p className="text-sm text-muted-foreground">Nerd@{follower.nerdAt}</p>
                </div>
              </div>
              {session.data?.user.id !== follower.id && (
                <Button
                  variant="outline"
                  onClick={() => handleFollow(follower.id)}
                >
                  {follower.isFollowingAuthor ? "Following" : "Follow"}
                </Button>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground">No followers yet</p>
        )}
      </div>
      {nextCursor && (
        <div className="mt-6 text-center">
          <Button onClick={() => setCursor(nextCursor)}>Load More</Button>
        </div>
      )}
    </div>
  );
};

export default Follower;
