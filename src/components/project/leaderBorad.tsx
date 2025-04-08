"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { GoStarFill } from "react-icons/go";
import Image from "next/image";
import { Flag, PackageIcon, Trophy, UserIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface ProjectRankingResponse {
  projects: {
    id: string;
    image: string;
    name: string;
    description: string;
    stars: number;
    follower: number;
    review: number;
    update: number;
  }[];
  nextCursor: string | null;
}

// Fetch function for ranked projects
const fetchRankedProjects = async (
  cursor: string | null,
): Promise<ProjectRankingResponse> => {
  const response = await axios.get<ProjectRankingResponse>(
    `/api/project/rank?cursor=${cursor || ""}`,
  );
  return response.data;
};

export default function LeaderboardPage() {
  const { data, isLoading, isFetching, fetchNextPage, hasNextPage } =
    useInfiniteQuery<ProjectRankingResponse, Error>({
      queryKey: ["rankedProjects"],
      queryFn: async ({ pageParam = null }) =>
        fetchRankedProjects(pageParam as string),
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialPageParam: null,
    });

  const loadMore = async () => {
    if (!hasNextPage) return;
    await fetchNextPage();
  };

  const allProjects = data?.pages?.flatMap((page) => page.projects) || [];

  return (
    <div className="container mx-auto max-w-5xl py-8">
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-4xl font-instrument  tracking-tight">
          Project Leaderboard
        </h1>
        <p className="text-muted-foreground font-inter">
          Discover the most popular and trending projects
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {allProjects.slice(0, 3).length === 3 ? (
          <>
            {/* Second place */}
            <div className="relative border-b border-r border-transparent before:absolute before:bottom-0 before:right-0 before:h-[1px] before:w-full before:bg-gradient-to-r before:from-transparent  before:to-transparent after:absolute after:bottom-0 after:right-0 after:h-full after:w-[1px] after:bg-gradient-to-b after:from-transparent after:via-blue-500/30 after:to-transparent [&>div]:before:absolute [&>div]:before:left-0 [&>div]:before:top-0 [&>div]:before:h-full [&>div]:before:w-[1px] [&>div]:before:bg-gradient-to-b [&>div]:before:from-transparent [&>div]:before:via-blue-500/30 [&>div]:before:to-transparent">
              <div className="absolute -bottom-20 -left-20 h-[150px] w-[150px] rotate-45 rounded-full bg-gradient-to-tl from-blue-300/10 via-blue-400/10 to-transparent blur-[60px]"></div>

              <Card
                className="relative overflow-hidden border-0 bg-background/80 backdrop-blur-sm dark:bg-black/10"
                key={`top-2-${allProjects[1]?.id}`}
              >
                <div className="absolute inset-0 z-0">
                  <Image
                    src={allProjects[1].image || "/user.jpg"}
                    alt={allProjects[1].name}
                    fill
                    className="object-cover opacity-10 blur-[1px] dark:opacity-20"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/50 to-background/30 dark:from-black dark:via-black/70 dark:to-black/30"></div>
                </div>

                <div className="absolute left-0 top-0 z-10 bg-gradient-to-r from-primary/10 to-primary/5 px-3 py-1 text-xs font-bold text-primary dark:from-slate-300 dark:to-slate-200 dark:text-slate-700">
                  #2
                </div>

                <div className="relative z-10 flex flex-col items-center p-6 pt-8">
                  <div className="mb-4 rounded-full border border-primary/20 bg-background/50 p-1 backdrop-blur-sm dark:border-slate-300/50 dark:bg-white/5">
                    <Image
                      height={80}
                      width={80}
                      src={allProjects[1].image || "/user.jpg"}
                      alt={allProjects[1].name}
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  </div>
                  <h3 className="mb-1 text-center text-lg font-bold text-foreground dark:text-white">
                    {allProjects[1].name}
                  </h3>
                  <p className="mb-4 line-clamp-2 text-center text-sm text-muted-foreground dark:text-white/80">
                    {allProjects[1].description}
                  </p>
                  <div className="flex w-full justify-between gap-2">
                    <div className="flex flex-col items-center">
                      <div className="mb-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/5 backdrop-blur-sm dark:bg-white/5">
                        <GoStarFill className="h-3 w-3 text-primary dark:text-white/70" />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground dark:text-white/90">
                        {allProjects[1].stars.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="mb-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/5 backdrop-blur-sm dark:bg-white/5">
                        <UserIcon className="h-3 w-3 text-primary dark:text-white/70" />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground dark:text-white/90">
                        {allProjects[1].follower.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="mb-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/5 backdrop-blur-sm dark:bg-white/5">
                        <Flag className="h-3 w-3 text-primary dark:text-white/70" />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground dark:text-white/90">
                        {allProjects[1].review.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="mb-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/5 backdrop-blur-sm dark:bg-white/5">
                        <PackageIcon className="h-3 w-3 text-primary dark:text-white/70" />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground dark:text-white/90">
                        {allProjects[1].update.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* First place */}
            <div className="relative border-b border-r border-transparent before:absolute before:bottom-0 before:right-0 before:h-[1px] before:w-full before:bg-gradient-to-r before:from-transparent before:via-amber-500/30 before:to-transparent after:absolute after:bottom-0 after:right-0 after:h-full after:w-[1px] after:bg-gradient-to-b after:from-transparent after:via-amber-500/30 after:to-transparent [&>div]:before:absolute [&>div]:before:left-0 [&>div]:before:top-0 [&>div]:before:h-full [&>div]:before:w-[1px] [&>div]:before:bg-gradient-to-b [&>div]:before:from-transparent [&>div]:before:via-amber-500/30 [&>div]:before:to-transparent">
              <div className="absolute -right-20 -top-20 h-[150px] w-[150px] -rotate-45 rounded-full bg-gradient-to-br from-amber-300/20 via-amber-400/20 to-transparent blur-[60px]"></div>

              <Card
                className="relative overflow-hidden border-0 bg-black/10 backdrop-blur-sm"
                key={`top-1-${allProjects[0]?.id}`}
              >
                <div className="absolute inset-0 z-0">
                  <Image
                    src={allProjects[0].image || "/user.jpg"}
                    alt={allProjects[0].name}
                    fill
                    className="object-cover opacity-20 blur-[1px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30"></div>
                </div>

                <div className="absolute left-0 top-0 z-10 bg-gradient-to-r from-amber-500 to-amber-300 px-3 py-1 text-xs font-bold text-amber-900">
                  #1
                </div>

                <div className="relative z-10 flex flex-col items-center p-6 pt-8">
                  <div className="mb-4 rounded-full border-2 border-amber-400/50 bg-white/5 p-1 backdrop-blur-sm">
                    <Image
                      height={80}
                      width={80}
                      src={allProjects[0].image || "/user.jpg"}
                      alt={allProjects[0].name}
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  </div>
                  <Trophy className="mb-2 h-5 w-5 text-amber-500" />
                  <h3 className="mb-1 text-center text-lg font-bold text-white">
                    {allProjects[0].name}
                  </h3>
                  <p className="mb-4 line-clamp-2 text-center text-sm text-white/80">
                    {allProjects[0].description}
                  </p>
                  <div className="flex w-full justify-between gap-2">
                    <div className="flex flex-col items-center">
                      <div className="mb-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/5 backdrop-blur-sm dark:bg-white/5">
                        <GoStarFill className="h-3 w-3 text-primary dark:text-white/70" />
                      </div>
                      <span className="text-xs font-medium text-white/90">
                        {allProjects[0].stars.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="mb-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/5 backdrop-blur-sm dark:bg-white/5">
                        <UserIcon className="h-3 w-3 text-primary dark:text-white/70" />
                      </div>
                      <span className="text-xs font-medium text-white/90">
                        {allProjects[0].follower.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="mb-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/5 backdrop-blur-sm dark:bg-white/5">
                        <Flag className="h-3 w-3 text-primary dark:text-white/70" />
                      </div>
                      <span className="text-xs font-medium text-white/90">
                        {allProjects[0].review.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="mb-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/5 backdrop-blur-sm dark:bg-white/5">
                        <PackageIcon className="h-3 w-3 text-primary dark:text-white/70" />
                      </div>
                      <span className="text-xs font-medium text-white/90">
                        {allProjects[0].update.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Third place */}
            <div className="relative border-b border-r border-transparent before:absolute before:bottom-0 before:right-0 before:h-[1px] before:w-full before:bg-gradient-to-r before:from-transparent  before:to-transparent after:absolute after:bottom-0 after:right-0 after:h-full after:w-[1px] after:bg-gradient-to-b after:from-transparent after:via-orange-500/30 after:to-transparent [&>div]:before:absolute [&>div]:before:left-0 [&>div]:before:top-0 [&>div]:before:h-full [&>div]:before:w-[1px] [&>div]:before:bg-gradient-to-b [&>div]:before:from-transparent [&>div]:before:via-orange-500/30 [&>div]:before:to-transparent">
              <div className="absolute -left-20 -top-20 h-[150px] w-[150px] rotate-45 rounded-full bg-gradient-to-tl from-orange-300/10  to-transparent blur-[60px]"></div>

              <Card
                className="relative overflow-hidden border-0 bg-black/10 backdrop-blur-sm"
                key={`top-3-${allProjects[2]?.id}`}
              >
                <div className="absolute inset-0 z-0">
                  <Image
                    src={allProjects[2].image || "/user.jpg"}
                    alt={allProjects[2].name}
                    fill
                    className="object-cover opacity-20 blur-[1px]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30"></div>
                </div>

                <div className="absolute left-0 top-0 z-10 bg-gradient-to-r from-amber-800 to-amber-600 px-3 py-1 text-xs font-bold text-amber-50">
                  #3
                </div>

                <div className="relative z-10 flex flex-col items-center p-6 pt-8">
                  <div className="mb-4 rounded-full border-2 border-amber-700/50 bg-white/5 p-1 backdrop-blur-sm">
                    <Image
                      height={80}
                      width={80}
                      src={allProjects[2].image || "/user.jpg"}
                      alt={allProjects[2].name}
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  </div>
                  <h3 className="mb-1 text-center text-lg font-bold text-white">
                    {allProjects[2].name}
                  </h3>
                  <p className="mb-4 line-clamp-2 text-center text-sm text-white/80">
                    {allProjects[2].description}
                  </p>
                  <div className="flex w-full justify-between gap-2">
                    <div className="flex flex-col items-center">
                      <div className="mb-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/5 backdrop-blur-sm dark:bg-white/5">
                        <GoStarFill className="h-3 w-3 text-primary dark:text-white/70" />
                      </div>
                      <span className="text-xs font-medium text-white/90">
                        {allProjects[2].stars.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="mb-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/5 backdrop-blur-sm dark:bg-white/5">
                        <UserIcon className="h-3 w-3 text-primary dark:text-white/70" />
                      </div>
                      <span className="text-xs font-medium text-white/90">
                        {allProjects[2].follower.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="mb-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/5 backdrop-blur-sm dark:bg-white/5">
                        <Flag className="h-3 w-3 text-primary dark:text-white/70" />
                      </div>
                      <span className="text-xs font-medium text-white/90">
                        {allProjects[2].review.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="mb-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/5 backdrop-blur-sm dark:bg-white/5">
                        <PackageIcon className="h-3 w-3 text-primary dark:text-white/70" />
                      </div>
                      <span className="text-xs font-medium text-white/90">
                        {allProjects[2].update.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </>
        ) : (
          <>
            <Skeleton className="h-80" />
            <Skeleton className="h-96" />
            <Skeleton className="h-80" />
          </>
        )}
      </div>

      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-semibold">All Rankings</h2>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-background/50 backdrop-blur-sm">
            <div className="flex items-center gap-1.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/5 dark:bg-white/5">
                <GoStarFill className="h-2.5 w-2.5 text-primary dark:text-white/70" />
              </div>
              <span className="text-muted-foreground dark:text-white/90">Stars</span>
            </div>
          </Badge>
          <Badge variant="outline" className="bg-background/50 backdrop-blur-sm">
            <div className="flex items-center gap-1.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/5 dark:bg-white/5">
                <UserIcon className="h-2.5 w-2.5 text-primary dark:text-white/70" />
              </div>
              <span className="text-muted-foreground dark:text-white/90">Followers</span>
            </div>
          </Badge>
          <Badge variant="outline" className="bg-background/50 backdrop-blur-sm">
            <div className="flex items-center gap-1.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/5 dark:bg-white/5">
                <Flag className="h-2.5 w-2.5 text-primary dark:text-white/70" />
              </div>
              <span className="text-muted-foreground dark:text-white/90">Reviews</span>
            </div>
          </Badge>
          <Badge variant="outline" className="bg-background/50 backdrop-blur-sm">
            <div className="flex items-center gap-1.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/5 dark:bg-white/5">
                <PackageIcon className="h-2.5 w-2.5 text-primary dark:text-white/70" />
              </div>
              <span className="text-muted-foreground dark:text-white/90">Updates</span>
            </div>
          </Badge>
        </div>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))
        ) : allProjects.length > 0 ? (
          allProjects.map((project, index) => (
            <Link
              href={`/project/${project.id}`}
              key={`${project.id}-${index}`}
              className="block"
            >
              <div className="relative border-b border-r border-transparent before:absolute before:bottom-0 before:right-0 before:h-[1px] before:w-full before:bg-gradient-to-r before:from-transparent  before:to-transparent after:absolute after:bottom-0 after:right-0 after:h-full after:w-[1px] after:bg-gradient-to-b after:from-transparent  [&>div]:before:absolute [&>div]:before:left-0 [&>div]:before:top-0 [&>div]:before:h-full [&>div]:before:w-[1px] [&>div]:before:bg-gradient-to-b [&>div]:before:from-transparent  [&>div]:before:to-transparent">
                <Card className="group relative my-2 flex items-center overflow-hidden border-0 bg-black/10 p-4 backdrop-blur-[2px] transition-all hover:bg-black/20">
                  <div className="absolute inset-0 z-0 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="absolute -bottom-20 -left-20 h-[200px] w-[200px] rotate-45 rounded-full bg-gradient-to-tl from-blue-300/10 via-blue-400/10 to-transparent blur-[80px]"></div>
                    <div className="absolute -right-20 -top-20 h-[200px] w-[200px] -rotate-45 rounded-full bg-gradient-to-br from-orange-300/10 to-transparent blur-[80px]"></div>
                  </div>

                  <div className="relative z-10 mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 font-bold text-black dark:text-white backdrop-blur-sm">
                    {index + 1}
                  </div>

                  <div className="relative z-10 flex flex-1 items-center gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-md">
                      <Image
                        height={1200}
                        width={1200}
                        src={project.image || "/user.jpg"}
                        alt={project.name}
                        className="h-16 w-16 rounded-md object-cover object-center transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-black dark:text-white">
                        {project.name}
                      </h3>
                      <p className="line-clamp-1 text-sm text-black  dark:text-white/70">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  <div className="relative z-10 hidden grid-cols-4 gap-2  md:grid border-white/10 border py-2 px-4 rounded-md">
                    <div className="flex items-center d">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/5 backdrop-blur-sm dark:bg-white/5">
                        <GoStarFill className="h-3 w-3 text-primary dark:text-white/70" />
                      </div>
                      <span className="font-medium text-muted-foreground dark:text-white/90">
                        {project.stars.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/5 backdrop-blur-sm dark:bg-white/5">
                        <UserIcon className="h-3 w-3 text-primary dark:text-white/70" />
                      </div>
                      <span className="font-medium text-muted-foreground dark:text-white/90">
                        {project.follower.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/5 backdrop-blur-sm dark:bg-white/5">
                        <Flag className="h-3 w-3 text-primary dark:text-white/70" />
                      </div>
                      <span className="font-medium text-muted-foreground dark:text-white/90">
                        {project.review.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/5 backdrop-blur-sm dark:bg-white/5">
                        <PackageIcon className="h-3 w-3 text-primary dark:text-white/70" />
                      </div>
                      <span className="font-medium text-muted-foreground dark:text-white/90">
                        {project.update.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="relative z-10 ml-4 flex items-center gap-3 md:hidden">
                    <div className="flex items-center gap-1.5">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/5 backdrop-blur-sm dark:bg-white/5">
                        <GoStarFill className="h-2.5 w-2.5 text-primary dark:text-white/70" />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground dark:text-white/90">
                        {project.stars.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/5 backdrop-blur-sm dark:bg-white/5">
                        <UserIcon className="h-2.5 w-2.5 text-primary dark:text-white/70" />
                      </div>
                      <span className="text-xs font-medium text-muted-foreground dark:text-white/90">
                        {project.follower.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            </Link>
          ))
        ) : (
          <Card className="p-8 text-center">
            <p className="text-muted-foreground">No projects available.</p>
          </Card>
        )}
      </div>

      {hasNextPage && (
        <div className="mt-6">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={isLoading || isFetching}
            className="w-full bg-white/10 text-white backdrop-blur-sm hover:bg-white/20"
          >
            {isLoading || isFetching ? "Loading..." : "Load More Projects"}
          </Button>
        </div>
      )}
    </div>
  );
}
