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
    <div className="container relative mx-auto max-w-5xl py-8">
      {/* Add gradient background effects */}
      <div className="absolute -bottom-20 -left-20 h-[200px] w-[200px] rotate-45 rounded-full bg-gradient-to-tl from-blue-300/10 via-blue-400/10 to-transparent blur-[80px]"></div>
      <div className="absolute -right-20 -top-20 h-[200px] w-[200px] -rotate-45 rounded-full bg-gradient-to-br from-orange-300/10 to-transparent blur-[80px]"></div>

      <div className="relative mb-8 text-center">
        <h1 className="font-geist mb-2 text-4xl font-medium tracking-tight">
          Project Leaderboard
        </h1>
        <p className="font-geist text-muted-foreground">
          Discover the most popular and trending projects
        </p>
      </div>

      <div className="relative mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {allProjects.slice(0, 3).length === 3 ? (
          <>
            {/* Second place */}
            <div className="group relative h-[380px] w-full max-w-sm overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-100 via-white to-zinc-50 shadow-md transition-all duration-300 hover:scale-[1.02] dark:from-zinc-900 dark:via-zinc-800/10 dark:to-black border-none">
              <div className="absolute inset-0 z-0 bg-gradient-to-br from-violet-500/5 via-transparent to-emerald-500/5 opacity-0 blur-xl transition-opacity duration-700 group-hover:opacity-100 dark:from-violet-500/10 dark:to-emerald-500/10"></div>

              <div className="absolute inset-0 z-0">
                <Image
                  src={allProjects[1].image || "/user.jpg"}
                  alt={allProjects[1].name}
                  fill
                  className="object-cover opacity-40 transition-all duration-700 group-hover:scale-105 group-hover:opacity-50 dark:opacity-40 dark:group-hover:opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-white/40 dark:from-black dark:via-black/80 dark:to-transparent"></div>
              </div>

              <div className="relative z-10 flex h-full flex-col p-6">
                <div className="mb-auto flex w-full items-start justify-between">
                  <div className="overflow-hidden rounded-xl bg-zinc-800/10 backdrop-blur-md dark:bg-white/10">
                    <div className="bg-zinc-800 px-3 py-1 text-center text-[10px] font-semibold text-white dark:bg-black/60">
                      #2
                    </div>
                  </div>
                </div>

                <div className="mt-auto space-y-4">
                  <Badge
                    variant="outline"
                    className="border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  >
                    Active
                  </Badge>

                  <h2 className="font-heading text-2xl font-instrument font-bold leading-tight text-zinc-900 dark:text-white">
                    {allProjects[1].name}
                  </h2>

                  <p className="line-clamp-2 text-xs leading-relaxed text-zinc-600 dark:text-white/80">
                    {allProjects[1].description}
                  </p>

                  <div className="flex w-full flex-wrap justify-center gap-2">
                    <div className="flex items-center gap-1 rounded-full border border-zinc-200 bg-white/50 px-2 py-1 backdrop-blur-sm dark:border-border/40 dark:bg-background/50">
                      <GoStarFill className="h-3 w-3 text-primary dark:text-primary" />
                      <span className="font-geist text-xs font-medium text-gray-800 dark:text-foreground">
                        {allProjects[1].stars.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 rounded-full border border-zinc-200 bg-white/50 px-2 py-1 backdrop-blur-sm dark:border-border/40 dark:bg-background/50">
                      <UserIcon className="h-3 w-3 text-primary dark:text-primary" />
                      <span className="font-geist text-xs font-medium text-gray-800 dark:text-foreground">
                        {allProjects[1].follower.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 rounded-full border border-zinc-200 bg-white/50 px-2 py-1 backdrop-blur-sm dark:border-border/40 dark:bg-background/50">
                      <Flag className="h-3 w-3 text-primary dark:text-primary" />
                      <span className="font-geist text-xs font-medium text-gray-800 dark:text-foreground">
                        {allProjects[1].review.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 rounded-full border border-zinc-200 bg-white/50 px-2 py-1 backdrop-blur-sm dark:border-border/40 dark:bg-background/50">
                      <PackageIcon className="h-3 w-3 text-primary dark:text-primary" />
                      <span className="font-geist text-xs font-medium text-gray-800 dark:text-foreground">
                        {allProjects[1].update.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 rounded-2xl border border-zinc-200 transition-all duration-300 group-hover:border-zinc-300 dark:border-white/5 dark:group-hover:border-white/10"></div>
            </div>

            {/* First place */}
            <div className="group relative h-[380px] w-full max-w-sm overflow-hidden rounded-2xl bg-gradient-to-br from-amber-100 via-white to-amber-50 shadow-md transition-all duration-300 hover:scale-[1.02] dark:from-amber-900 dark:via-amber-800/10 dark:to-black border-none">
              <div className="absolute inset-0 z-0 bg-gradient-to-br from-amber-500/5 via-transparent to-amber-500/5 opacity-0 blur-xl transition-opacity duration-700 group-hover:opacity-100 dark:from-amber-500/10 dark:to-amber-500/10"></div>

              <div className="absolute inset-0 z-0">
                <Image
                  src={allProjects[0].image || "/user.jpg"}
                  alt={allProjects[0].name}
                  fill
                  className="object-cover opacity-40 transition-all duration-700 group-hover:scale-105 group-hover:opacity-50 dark:opacity-40 dark:group-hover:opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-white/40 dark:from-black dark:via-black/80 dark:to-transparent"></div>
              </div>

              <div className="relative z-10 flex h-full flex-col p-6">
                <div className="mb-auto flex w-full items-start justify-between">
                  <div className="overflow-hidden rounded-xl bg-amber-800/10 backdrop-blur-md dark:bg-white/10">
                    <div className="bg-amber-800 px-3 py-1 text-center text-[10px] font-semibold text-white dark:bg-black/60">
                      #1
                    </div>
                  </div>
                  <Trophy className="h-5 w-5 text-amber-500 dark:text-amber-500" />
                </div>

                <div className="mt-auto space-y-4">
                  <Badge
                    variant="outline"
                    className="border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-400"
                  >
                    Active
                  </Badge>

                  <h2 className="font-heading text-2xl font-instrument font-bold leading-tight text-amber-900 dark:text-white">
                    {allProjects[0].name}
                  </h2>

                  <p className="line-clamp-2 text-xs leading-relaxed text-amber-600 dark:text-white/80">
                    {allProjects[0].description}
                  </p>

                  <div className="flex w-full flex-wrap justify-center gap-2">
                    <div className="flex items-center gap-1 rounded-full border border-amber-200 bg-white/50 px-2 py-1 backdrop-blur-sm dark:border-border/40 dark:bg-background/50">
                      <GoStarFill className="h-3 w-3 text-amber-600 dark:text-primary" />
                      <span className="font-geist text-xs font-medium text-gray-800 dark:text-foreground">
                        {allProjects[0].stars.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 rounded-full border border-amber-200 bg-white/50 px-2 py-1 backdrop-blur-sm dark:border-border/40 dark:bg-background/50">
                      <UserIcon className="h-3 w-3 text-amber-600 dark:text-primary" />
                      <span className="font-geist text-xs font-medium text-gray-800 dark:text-foreground">
                        {allProjects[0].follower.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 rounded-full border border-amber-200 bg-white/50 px-2 py-1 backdrop-blur-sm dark:border-border/40 dark:bg-background/50">
                      <Flag className="h-3 w-3 text-amber-600 dark:text-primary" />
                      <span className="font-geist text-xs font-medium text-gray-800 dark:text-foreground">
                        {allProjects[0].review.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 rounded-full border border-amber-200 bg-white/50 px-2 py-1 backdrop-blur-sm dark:border-border/40 dark:bg-background/50">
                      <PackageIcon className="h-3 w-3 text-amber-600 dark:text-primary" />
                      <span className="font-geist text-xs font-medium text-gray-800 dark:text-foreground">
                        {allProjects[0].update.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 rounded-2xl border border-amber-200 transition-all duration-300 group-hover:border-amber-300 dark:border-white/5 dark:group-hover:border-white/10"></div>
            </div>

            {/* Third place */}
            <div className="group relative h-[380px] w-full max-w-sm overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-100 via-white to-zinc-50 shadow-md transition-all duration-300 hover:scale-[1.02] dark:from-zinc-900 dark:via-zinc-800/10 dark:to-black border-none">
              <div className="absolute inset-0 z-0 bg-gradient-to-br from-violet-500/5 via-transparent to-emerald-500/5 opacity-0 blur-xl transition-opacity duration-700 group-hover:opacity-100 dark:from-violet-500/10 dark:to-emerald-500/10"></div>

              <div className="absolute inset-0 z-0">
                <Image
                  src={allProjects[2].image || "/user.jpg"}
                  alt={allProjects[2].name}
                  fill
                  className="object-cover opacity-40 transition-all duration-700 group-hover:scale-105 group-hover:opacity-50 dark:opacity-40 dark:group-hover:opacity-50"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-white/40 dark:from-black dark:via-black/80 dark:to-transparent"></div>
              </div>

              <div className="relative z-10 flex h-full flex-col p-6">
                <div className="mb-auto flex w-full items-start justify-between">
                  <div className="overflow-hidden rounded-xl bg-zinc-800/10 backdrop-blur-md dark:bg-white/10">
                    <div className="bg-zinc-800 px-3 py-1 text-center text-[10px] font-semibold text-white dark:bg-black/60">
                      #3
                    </div>
                  </div>
                </div>

                <div className="mt-auto space-y-4">
                  <Badge
                    variant="outline"
                    className="border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
                  >
                    Active
                  </Badge>

                  <h2 className="font-heading text-2xl font-instrument font-bold leading-tight text-zinc-900 dark:text-white">
                    {allProjects[2].name}
                  </h2>

                  <p className="line-clamp-2 text-xs leading-relaxed text-zinc-600 dark:text-white/80">
                    {allProjects[2].description}
                  </p>

                  <div className="flex w-full flex-wrap justify-center gap-2">
                    <div className="flex items-center gap-1 rounded-full border border-zinc-200 bg-white/50 px-2 py-1 backdrop-blur-sm dark:border-border/40 dark:bg-background/50">
                      <GoStarFill className="h-3 w-3 text-primary dark:text-primary" />
                      <span className="font-geist text-xs font-medium text-gray-800 dark:text-foreground">
                        {allProjects[2].stars.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 rounded-full border border-zinc-200 bg-white/50 px-2 py-1 backdrop-blur-sm dark:border-border/40 dark:bg-background/50">
                      <UserIcon className="h-3 w-3 text-primary dark:text-primary" />
                      <span className="font-geist text-xs font-medium text-gray-800 dark:text-foreground">
                        {allProjects[2].follower.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 rounded-full border border-zinc-200 bg-white/50 px-2 py-1 backdrop-blur-sm dark:border-border/40 dark:bg-background/50">
                      <Flag className="h-3 w-3 text-primary dark:text-primary" />
                      <span className="font-geist text-xs font-medium text-gray-800 dark:text-foreground">
                        {allProjects[2].review.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 rounded-full border border-zinc-200 bg-white/50 px-2 py-1 backdrop-blur-sm dark:border-border/40 dark:bg-background/50">
                      <PackageIcon className="h-3 w-3 text-primary dark:text-primary" />
                      <span className="font-geist text-xs font-medium text-gray-800 dark:text-foreground">
                        {allProjects[2].update.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 rounded-2xl border border-zinc-200 transition-all duration-300 group-hover:border-zinc-300 dark:border-white/5 dark:group-hover:border-white/10"></div>
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

      <div className="relative mb-4 flex items-center justify-between">
        <h2 className="font-geist text-xl font-medium">All Rankings</h2>
        <div className="flex gap-2">
          <Badge
            variant="outline"
            className="bg-white/80 py-2 px-4 rounded-full  backdrop-blur-sm dark:bg-black/80"
          >
            <div className="flex items-center gap-1.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                <GoStarFill className="h-2.5 w-2.5 text-primary" />
              </div>
              <span className="font-geist text-gray-600 dark:text-muted-foreground">
                Stars
              </span>
            </div>
          </Badge>
          <Badge
            variant="outline"
            className="bg-white/80 py-2 px-4 rounded-full  backdrop-blur-sm dark:bg-black/80"
          >
            <div className="flex items-center gap-1.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                <UserIcon className="h-2.5 w-2.5 text-primary" />
              </div>
              <span className="font-geist text-gray-600 dark:text-muted-foreground">
                Followers
              </span>
            </div>
          </Badge>
          <Badge
            variant="outline"
            className="bg-white/80 py-2 px-4 rounded-full  backdrop-blur-sm dark:bg-black/80"
          >
            <div className="flex items-center gap-1.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                <Flag className="h-2.5 w-2.5 text-primary" />
              </div>
              <span className="font-geist text-gray-600 dark:text-muted-foreground">
                Reviews
              </span>
            </div>
          </Badge>
          <Badge
            variant="outline"
            className="bg-white/80 py-2 px-4 rounded-full  backdrop-blur-sm dark:bg-black/80"
          >
            <div className="flex items-center gap-1.5">
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                <PackageIcon className="h-2.5 w-2.5 text-primary" />
              </div>
              <span className="font-geist text-gray-600 dark:text-muted-foreground">
                Updates
              </span>
            </div>
          </Badge>
        </div>
      </div>

      <div className="relative space-y-3">
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
              <div className="group relative overflow-hidden rounded-xl border border-border/10 bg-card/50 shadow-sm backdrop-blur-sm dark:bg-transparent dark:border-none">
                <Card className="group relative my-2 flex items-center dark:border-border/20 overflow-hidden border-0 bg-white/80 p-4 backdrop-blur-[2px] transition-all hover:bg-gray-50 dark:bg-black/80">
                  <div className="absolute inset-0 z-0 opacity-0 transition-opacity group-hover:opacity-100">
                    <div className="absolute -bottom-20 -left-20 h-[200px] w-[200px] rotate-45 rounded-full bg-gradient-to-tl from-blue-300/10 via-blue-400/10 to-transparent blur-[80px]"></div>
                    <div className="absolute -right-20 -top-20 h-[200px] w-[200px] -rotate-45 rounded-full bg-gradient-to-br from-orange-300/10 to-transparent blur-[80px]"></div>
                  </div>

                  <div className="relative z-10 mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 font-bold text-gray-800 backdrop-blur-sm dark:bg-black/80 dark:text-foreground dark:border dark:border-border/40">
                    {index + 1}
                  </div>

                  <div className="relative z-10 flex flex-1 items-center gap-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-md">
                      <Image
                        height={1200}
                        width={1200}
                        src={project.image || "/user.jpg"}
                        alt={project.name}
                        className="h-16 w-16 rounded-md object-cover object-center transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-200/40 to-transparent"></div>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-geist font-medium text-gray-800 dark:text-foreground">
                        {project.name}
                      </h3>
                      <p className="font-geist line-clamp-1 text-sm text-gray-600 dark:text-muted-foreground">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  <div className="relative z-10 hidden grid-cols-4 gap-2 rounded-full border border-gray-200 px-4 py-3 dark:border-border/40 md:grid">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                        <GoStarFill className="h-3 w-3 text-primary" />
                      </div>
                      <span className="font-geist font-medium text-gray-600 dark:text-muted-foreground">
                        {project.stars.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                        <UserIcon className="h-3 w-3 text-primary" />
                      </div>
                      <span className="font-geist font-medium text-gray-600 dark:text-muted-foreground">
                        {project.follower.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                        <Flag className="h-3 w-3 text-primary" />
                      </div>
                      <span className="font-geist font-medium text-gray-600 dark:text-muted-foreground">
                        {project.review.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10">
                        <PackageIcon className="h-3 w-3 text-primary" />
                      </div>
                      <span className="font-geist font-medium text-gray-600 dark:text-muted-foreground">
                        {project.update.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="relative z-10 ml-4 flex items-center gap-3 md:hidden">
                    <div className="flex items-center gap-1.5">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                        <GoStarFill className="h-2.5 w-2.5 text-primary" />
                      </div>
                      <span className="font-geist text-xs font-medium text-gray-600 dark:text-muted-foreground">
                        {project.stars.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10">
                        <UserIcon className="h-2.5 w-2.5 text-primary" />
                      </div>
                      <span className="font-geist text-xs font-medium text-gray-600 dark:text-muted-foreground">
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
            <p className="font-geist text-muted-foreground">
              No projects available.
            </p>
          </Card>
        )}
      </div>

      {hasNextPage && (
        <div className="relative mt-6">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={isLoading || isFetching}
            className="font-geist w-full bg-white/80 text-gray-800 backdrop-blur-sm hover:bg-gray-100 dark:bg-black/80 dark:text-foreground dark:hover:bg-background/90"
          >
            {isLoading || isFetching ? "Loading..." : "Load More Projects"}
          </Button>
        </div>
      )}
    </div>
  );
}
