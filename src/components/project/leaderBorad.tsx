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
    <div className="relative mx-auto py-8 max-w-5xl container">
      {/* Add gradient background effects */}
      <div className="-bottom-20 -left-20 absolute bg-gradient-to-tl from-blue-300/10 via-blue-400/10 to-transparent blur-[80px] rounded-full w-[200px] h-[200px] rotate-45"></div>
      <div className="-top-20 -right-20 absolute bg-gradient-to-br from-orange-300/10 to-transparent blur-[80px] rounded-full w-[200px] h-[200px] -rotate-45"></div>

      <div className="relative mb-8 text-center">
        <h1 className="mb-2 font-geist font-medium text-4xl tracking-tight">
          Project Leaderboard
        </h1>
        <p className="font-geist text-muted-foreground">
          Discover the most popular and trending projects
        </p>
      </div>

      <div className="relative gap-4 grid grid-cols-1 md:grid-cols-3 mb-6">
        {allProjects.slice(0, 3).length === 3 ? (
          <>
            {/* Second place - First on mobile, left on desktop */}
            <div className="group relative order-1 md:order-1 bg-gradient-to-br from-zinc-100 dark:from-zinc-900 via-white dark:via-zinc-800/10 to-zinc-50 dark:to-black shadow-md border-none rounded-2xl w-full max-w-sm h-[280px] md:h-[380px] overflow-hidden hover:scale-[1.02] transition-all duration-300">
              <div className="z-0 absolute inset-0 bg-gradient-to-br from-violet-500/5 dark:from-violet-500/10 via-transparent to-emerald-500/5 dark:to-emerald-500/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700"></div>

              <div className="z-0 absolute inset-0">
                <Image
                  src={allProjects[1].image || "/user.jpg"}
                  alt={allProjects[1].name}
                  fill
                  className="opacity-40 dark:group-hover:opacity-50 dark:opacity-40 group-hover:opacity-50 object-cover group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-black via-white/80 dark:via-black/80 to-white/40 dark:to-transparent"></div>
              </div>

              <div className="z-10 relative flex flex-col p-4 md:p-6 h-full">
                <div className="flex justify-between items-start mb-auto w-full">
                  <div className="bg-zinc-800/10 dark:bg-white/10 backdrop-blur-md rounded-xl overflow-hidden">
                    <div className="bg-zinc-800 dark:bg-black/60 px-3 py-1 font-semibold text-[10px] text-white text-center">
                      #2
                    </div>
                  </div>
                </div>

                <div className="space-y-3 md:space-y-4 mt-auto">
                  <Badge
                    variant="outline"
                    className="bg-emerald-500/10 border-emerald-500/50 text-emerald-700 dark:text-emerald-400"
                  >
                    Active
                  </Badge>

                  <h2 className="font-heading font-instrument font-bold text-zinc-900 dark:text-white text-xl md:text-2xl leading-tight">
                    {allProjects[1].name}
                  </h2>

                  <p className="text-zinc-600 dark:text-white/80 text-xs line-clamp-2 leading-relaxed">
                    {allProjects[1].description}
                  </p>

                  <div className="flex flex-wrap justify-center gap-1.5 md:gap-2 w-full">
                    <div className="flex items-center gap-1 bg-white/50 dark:bg-background/50 backdrop-blur-sm px-2 py-1 border border-zinc-200 dark:border-border/40 rounded-full">
                      <GoStarFill className="w-3 h-3 text-primary dark:text-primary" />
                      <span className="font-geist font-medium text-gray-800 dark:text-foreground text-xs">
                        {allProjects[1].stars.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 bg-white/50 dark:bg-background/50 backdrop-blur-sm px-2 py-1 border border-zinc-200 dark:border-border/40 rounded-full">
                      <UserIcon className="w-3 h-3 text-primary dark:text-primary" />
                      <span className="font-geist font-medium text-gray-800 dark:text-foreground text-xs">
                        {allProjects[1].follower.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 bg-white/50 dark:bg-background/50 backdrop-blur-sm px-2 py-1 border border-zinc-200 dark:border-border/40 rounded-full">
                      <Flag className="w-3 h-3 text-primary dark:text-primary" />
                      <span className="font-geist font-medium text-gray-800 dark:text-foreground text-xs">
                        {allProjects[1].review.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 bg-white/50 dark:bg-background/50 backdrop-blur-sm px-2 py-1 border border-zinc-200 dark:border-border/40 rounded-full">
                      <PackageIcon className="w-3 h-3 text-primary dark:text-primary" />
                      <span className="font-geist font-medium text-gray-800 dark:text-foreground text-xs">
                        {allProjects[1].update.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 border border-zinc-200 dark:border-white/5 dark:group-hover:border-white/10 group-hover:border-zinc-300 rounded-2xl transition-all duration-300"></div>
            </div>

            {/* First place - Second on mobile, center on desktop */}
            <div className="group relative order-2 md:order-2 bg-gradient-to-br from-amber-100 dark:from-amber-900 via-white dark:via-amber-800/10 to-amber-50 dark:to-black shadow-md border-none rounded-2xl w-full max-w-sm h-[320px] md:h-[380px] overflow-hidden hover:scale-[1.02] transition-all duration-300">
              <div className="z-0 absolute inset-0 bg-gradient-to-br from-amber-500/5 dark:from-amber-500/10 via-transparent to-amber-500/5 dark:to-amber-500/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700"></div>

              <div className="z-0 absolute inset-0">
                <Image
                  src={allProjects[0].image || "/user.jpg"}
                  alt={allProjects[0].name}
                  fill
                  className="opacity-40 dark:group-hover:opacity-50 dark:opacity-40 group-hover:opacity-50 object-cover group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-black via-white/80 dark:via-black/80 to-white/40 dark:to-transparent"></div>
              </div>

              <div className="z-10 relative flex flex-col p-4 md:p-6 h-full">
                <div className="flex justify-between items-start mb-auto w-full">
                  <div className="bg-amber-800/10 dark:bg-white/10 backdrop-blur-md rounded-xl overflow-hidden">
                    <div className="bg-amber-800 dark:bg-black/60 px-3 py-1 font-semibold text-[10px] text-white text-center">
                      #1
                    </div>
                  </div>
                  <Trophy className="w-5 h-5 text-amber-500 dark:text-amber-500" />
                </div>

                <div className="space-y-3 md:space-y-4 mt-auto">
                  <Badge
                    variant="outline"
                    className="bg-amber-500/10 border-amber-500/50 text-amber-700 dark:text-amber-400"
                  >
                    Active
                  </Badge>

                  <h2 className="font-heading font-instrument font-bold text-amber-900 dark:text-white text-xl md:text-2xl leading-tight">
                    {allProjects[0].name}
                  </h2>

                  <p className="text-amber-600 dark:text-white/80 text-xs line-clamp-2 leading-relaxed">
                    {allProjects[0].description}
                  </p>

                  <div className="flex flex-wrap justify-center gap-1.5 md:gap-2 w-full">
                    <div className="flex items-center gap-1 bg-white/50 dark:bg-background/50 backdrop-blur-sm px-2 py-1 border border-amber-200 dark:border-border/40 rounded-full">
                      <GoStarFill className="w-3 h-3 text-amber-600 dark:text-primary" />
                      <span className="font-geist font-medium text-gray-800 dark:text-foreground text-xs">
                        {allProjects[0].stars.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 bg-white/50 dark:bg-background/50 backdrop-blur-sm px-2 py-1 border border-amber-200 dark:border-border/40 rounded-full">
                      <UserIcon className="w-3 h-3 text-amber-600 dark:text-primary" />
                      <span className="font-geist font-medium text-gray-800 dark:text-foreground text-xs">
                        {allProjects[0].follower.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 bg-white/50 dark:bg-background/50 backdrop-blur-sm px-2 py-1 border border-amber-200 dark:border-border/40 rounded-full">
                      <Flag className="w-3 h-3 text-amber-600 dark:text-primary" />
                      <span className="font-geist font-medium text-gray-800 dark:text-foreground text-xs">
                        {allProjects[0].review.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 bg-white/50 dark:bg-background/50 backdrop-blur-sm px-2 py-1 border border-amber-200 dark:border-border/40 rounded-full">
                      <PackageIcon className="w-3 h-3 text-amber-600 dark:text-primary" />
                      <span className="font-geist font-medium text-gray-800 dark:text-foreground text-xs">
                        {allProjects[0].update.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 border border-amber-200 dark:border-white/5 dark:group-hover:border-white/10 group-hover:border-amber-300 rounded-2xl transition-all duration-300"></div>
            </div>

            {/* Third place - Third on mobile, right on desktop */}
            <div className="group relative order-3 md:order-3 bg-gradient-to-br from-zinc-100 dark:from-zinc-900 via-white dark:via-zinc-800/10 to-zinc-50 dark:to-black shadow-md border-none rounded-2xl w-full max-w-sm h-[280px] md:h-[380px] overflow-hidden hover:scale-[1.02] transition-all duration-300">
              <div className="z-0 absolute inset-0 bg-gradient-to-br from-violet-500/5 dark:from-violet-500/10 via-transparent to-emerald-500/5 dark:to-emerald-500/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700"></div>

              <div className="z-0 absolute inset-0">
                <Image
                  src={allProjects[2].image || "/user.jpg"}
                  alt={allProjects[2].name}
                  fill
                  className="opacity-40 dark:group-hover:opacity-50 dark:opacity-40 group-hover:opacity-50 object-cover group-hover:scale-105 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-black via-white/80 dark:via-black/80 to-white/40 dark:to-transparent"></div>
              </div>

              <div className="z-10 relative flex flex-col p-4 md:p-6 h-full">
                <div className="flex justify-between items-start mb-auto w-full">
                  <div className="bg-zinc-800/10 dark:bg-white/10 backdrop-blur-md rounded-xl overflow-hidden">
                    <div className="bg-zinc-800 dark:bg-black/60 px-3 py-1 font-semibold text-[10px] text-white text-center">
                      #3
                    </div>
                  </div>
                </div>

                <div className="space-y-3 md:space-y-4 mt-auto">
                  <Badge
                    variant="outline"
                    className="bg-emerald-500/10 border-emerald-500/50 text-emerald-700 dark:text-emerald-400"
                  >
                    Active
                  </Badge>

                  <h2 className="font-heading font-instrument font-bold text-zinc-900 dark:text-white text-xl md:text-2xl leading-tight">
                    {allProjects[2].name}
                  </h2>

                  <p className="text-zinc-600 dark:text-white/80 text-xs line-clamp-2 leading-relaxed">
                    {allProjects[2].description}
                  </p>

                  <div className="flex flex-wrap justify-center gap-1.5 md:gap-2 w-full">
                    <div className="flex items-center gap-1 bg-white/50 dark:bg-background/50 backdrop-blur-sm px-2 py-1 border border-zinc-200 dark:border-border/40 rounded-full">
                      <GoStarFill className="w-3 h-3 text-primary dark:text-primary" />
                      <span className="font-geist font-medium text-gray-800 dark:text-foreground text-xs">
                        {allProjects[2].stars.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 bg-white/50 dark:bg-background/50 backdrop-blur-sm px-2 py-1 border border-zinc-200 dark:border-border/40 rounded-full">
                      <UserIcon className="w-3 h-3 text-primary dark:text-primary" />
                      <span className="font-geist font-medium text-gray-800 dark:text-foreground text-xs">
                        {allProjects[2].follower.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 bg-white/50 dark:bg-background/50 backdrop-blur-sm px-2 py-1 border border-zinc-200 dark:border-border/40 rounded-full">
                      <Flag className="w-3 h-3 text-primary dark:text-primary" />
                      <span className="font-geist font-medium text-gray-800 dark:text-foreground text-xs">
                        {allProjects[2].review.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 bg-white/50 dark:bg-background/50 backdrop-blur-sm px-2 py-1 border border-zinc-200 dark:border-border/40 rounded-full">
                      <PackageIcon className="w-3 h-3 text-primary dark:text-primary" />
                      <span className="font-geist font-medium text-gray-800 dark:text-foreground text-xs">
                        {allProjects[2].update.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 border border-zinc-200 dark:border-white/5 dark:group-hover:border-white/10 group-hover:border-zinc-300 rounded-2xl transition-all duration-300"></div>
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

      <div className="relative flex justify-between items-center mb-4">
        <h2 className="font-geist font-medium text-xl">All Rankings</h2>
        <div className="flex gap-2">
          <Badge
            variant="outline"
            className="bg-white/80 dark:bg-black/80 backdrop-blur-sm px-4 py-2 rounded-full"
          >
            <div className="flex items-center gap-1.5">
              <div className="flex justify-center items-center bg-primary/10 rounded-full w-5 h-5">
                <GoStarFill className="w-2.5 h-2.5 text-primary" />
              </div>
              <span className="font-geist text-gray-600 dark:text-muted-foreground">
                Stars
              </span>
            </div>
          </Badge>
          <Badge
            variant="outline"
            className="bg-white/80 dark:bg-black/80 backdrop-blur-sm px-4 py-2 rounded-full"
          >
            <div className="flex items-center gap-1.5">
              <div className="flex justify-center items-center bg-primary/10 rounded-full w-5 h-5">
                <UserIcon className="w-2.5 h-2.5 text-primary" />
              </div>
              <span className="font-geist text-gray-600 dark:text-muted-foreground">
                Followers
              </span>
            </div>
          </Badge>
          <Badge
            variant="outline"
            className="bg-white/80 dark:bg-black/80 backdrop-blur-sm px-4 py-2 rounded-full"
          >
            <div className="flex items-center gap-1.5">
              <div className="flex justify-center items-center bg-primary/10 rounded-full w-5 h-5">
                <Flag className="w-2.5 h-2.5 text-primary" />
              </div>
              <span className="font-geist text-gray-600 dark:text-muted-foreground">
                Reviews
              </span>
            </div>
          </Badge>
          <Badge
            variant="outline"
            className="bg-white/80 dark:bg-black/80 backdrop-blur-sm px-4 py-2 rounded-full"
          >
            <div className="flex items-center gap-1.5">
              <div className="flex justify-center items-center bg-primary/10 rounded-full w-5 h-5">
                <PackageIcon className="w-2.5 h-2.5 text-primary" />
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
              <div className="group relative bg-card/50 dark:bg-transparent shadow-sm backdrop-blur-sm border border-border/10 dark:border-none rounded-xl overflow-hidden">
                <Card className="group relative flex items-center bg-white/80 hover:bg-gray-50 dark:bg-black/80 backdrop-blur-[2px] my-2 p-4 border-0 dark:border-border/20 overflow-hidden transition-all">
                  <div className="z-0 absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="-bottom-20 -left-20 absolute bg-gradient-to-tl from-blue-300/10 via-blue-400/10 to-transparent blur-[80px] rounded-full w-[200px] h-[200px] rotate-45"></div>
                    <div className="-top-20 -right-20 absolute bg-gradient-to-br from-orange-300/10 to-transparent blur-[80px] rounded-full w-[200px] h-[200px] -rotate-45"></div>
                  </div>

                  <div className="z-10 relative flex justify-center items-center bg-gray-100 dark:bg-black/80 backdrop-blur-sm mr-4 dark:border dark:border-border/40 rounded-full w-8 h-8 font-bold text-gray-800 dark:text-foreground">
                    {index + 1}
                  </div>

                  <div className="z-10 relative flex flex-1 items-center gap-4">
                    <div className="relative rounded-md w-16 h-16 overflow-hidden">
                      <Image
                        height={1200}
                        width={1200}
                        src={project.image || "/user.jpg"}
                        alt={project.name}
                        className="rounded-md w-16 h-16 object-center object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-200/40 to-transparent"></div>
                    </div>

                    <div className="flex-1">
                      <h3 className="font-geist font-medium text-gray-800 dark:text-foreground">
                        {project.name}
                      </h3>
                      <p className="font-geist text-gray-600 dark:text-muted-foreground text-sm line-clamp-1">
                        {project.description}
                      </p>
                    </div>
                  </div>

                  <div className="hidden z-10 relative gap-2 md:grid grid-cols-4 px-4 py-3 border border-gray-200 dark:border-border/40 rounded-full">
                    <div className="flex items-center gap-2">
                      <div className="flex justify-center items-center bg-primary/10 rounded-full w-6 h-6">
                        <GoStarFill className="w-3 h-3 text-primary" />
                      </div>
                      <span className="font-geist font-medium text-gray-600 dark:text-muted-foreground">
                        {project.stars.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex justify-center items-center bg-primary/10 rounded-full w-6 h-6">
                        <UserIcon className="w-3 h-3 text-primary" />
                      </div>
                      <span className="font-geist font-medium text-gray-600 dark:text-muted-foreground">
                        {project.follower.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex justify-center items-center bg-primary/10 rounded-full w-6 h-6">
                        <Flag className="w-3 h-3 text-primary" />
                      </div>
                      <span className="font-geist font-medium text-gray-600 dark:text-muted-foreground">
                        {project.review.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex justify-center items-center bg-primary/10 rounded-full w-6 h-6">
                        <PackageIcon className="w-3 h-3 text-primary" />
                      </div>
                      <span className="font-geist font-medium text-gray-600 dark:text-muted-foreground">
                        {project.update.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="md:hidden z-10 relative flex items-center gap-3 ml-4">
                    <div className="flex items-center gap-1.5">
                      <div className="flex justify-center items-center bg-primary/10 rounded-full w-5 h-5">
                        <GoStarFill className="w-2.5 h-2.5 text-primary" />
                      </div>
                      <span className="font-geist font-medium text-gray-600 dark:text-muted-foreground text-xs">
                        {project.stars.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="flex justify-center items-center bg-primary/10 rounded-full w-5 h-5">
                        <UserIcon className="w-2.5 h-2.5 text-primary" />
                      </div>
                      <span className="font-geist font-medium text-gray-600 dark:text-muted-foreground text-xs">
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
            className="bg-white/80 hover:bg-gray-100 dark:bg-black/80 dark:hover:bg-background/90 backdrop-blur-sm w-full font-geist text-gray-800 dark:text-foreground"
          >
            {isLoading || isFetching ? "Loading..." : "Load More Projects"}
          </Button>
        </div>
      )}
    </div>
  );
}
