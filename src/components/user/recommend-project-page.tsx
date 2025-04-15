"use client";

import UserInterface from "@/interface/auth/user.interface";
import { authClient } from "@/lib/auth-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Calendar, Star } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import { ProjectRecommendationSkeleton } from "./FollowListSkeleton";

const ProjectRecommendationList = () => {
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

  if (isLoading) return <ProjectRecommendationSkeleton />;
  if (isError) return <p>Error loading users</p>;

  const users: UserInterface[] = data?.data || [];
  const nextCursor: string | null = data?.nextCursor || null;

  return (
    <div className="container relative mx-auto pb-8">
      {/* Gradient background effects */}
      <div className="absolute hidden md:block -right-10 -top-20 h-[300px] w-[300px] -rotate-45 rounded-full border border-amber-300/50 bg-gradient-to-br from-amber-300/40 via-amber-400/50 to-transparent blur-[80px] dark:from-orange-300/40 dark:via-orange-400/50"></div>
      <div className="absolute hidden md:block -left-10 -bottom-20 h-[300px] w-[300px] rotate-45 rounded-full border border-blue-300/50 bg-gradient-to-tl from-blue-300/40 via-blue-400/50 to-transparent blur-[80px] dark:from-indigo-300/40 dark:via-indigo-400/50"></div>

      <div className="group relative z-10 my-5 hidden gap-2 overflow-hidden rounded-xl border border-gray-100 bg-gradient-to-br from-white/50 via-white/30 to-transparent px-4 py-5 shadow-none transition-all duration-500 hover:border-gray-200/50 dark:border-gray-500/5 dark:from-black/50 dark:via-black/30 md:flex md:flex-col lg:w-[19vw]">
        {/* Subtle animated glow effect */}
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-violet-500/5 via-transparent to-emerald-500/5 opacity-0 blur-xl transition-opacity duration-700 group-hover:opacity-100 dark:from-violet-500/10 dark:to-emerald-500/10"></div>

        <div className="relative z-10">
          <h1
            className="font-instrument text-2xl italic transition-all duration-300 hover:cursor-pointer hover:text-primary dark:hover:text-primary"
            onClick={() => {
              router.push("/whotofollow");
            }}
          >
            Who to Follow
          </h1>
          <div className="mt-4 space-y-3">
            {users.length > 0 ? (
              users.map((u) => (
                <div
                  key={u.id}
                  className="group/item relative flex items-center justify-between rounded-xl border border-gray-100/50 bg-white/5 p-3 transition-all duration-300 hover:border-gray-200/50 hover:bg-white/10 dark:border-gray-500/5 dark:hover:border-gray-500/10"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-white/10">
                      <Image
                        src={u.image || "/user.jpg"}
                        alt="user"
                        fill
                        className="object-cover transition-transform duration-500 group-hover/item:scale-110"
                        sizes="(max-width: 48px) 100vw, 48px"
                      />
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium transition-colors duration-300 hover:text-primary dark:hover:text-primary">
                        {u.visualName}
                      </span>
                      <div className="flex items-center gap-2">
                        <Star className="h-3 w-3 text-yellow-500" />
                        <span className="text-xs text-muted-foreground">
                          Nerd@{u.nerdAt}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    className="border bg-transparent text-card-foreground shadow-none transition-colors duration-300 hover:bg-primary/10 hover:text-primary dark:text-white dark:hover:bg-primary/20"
                    onClick={() => handleFollow(u.id)}
                  >
                    Follow
                  </Button>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-gray-100/50 bg-white/5 p-6 text-center dark:border-gray-500/5">
                <Calendar className="mb-2 h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  No suggestions available
                </p>
              </div>
            )}
          </div>
          {nextCursor && (
            <Button
              onClick={() => setCursor(nextCursor)}
              className="mt-4 w-full border bg-transparent text-card-foreground shadow-none transition-colors duration-300 hover:bg-primary/10 hover:text-primary dark:text-white dark:hover:bg-primary/20"
            >
              Load More
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectRecommendationList;
