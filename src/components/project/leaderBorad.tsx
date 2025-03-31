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
import Link from "next/link"; // Import Link from next/link

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
        <h1 className="mb-2 text-3xl font-bold tracking-tight">
          Project Leaderboard
        </h1>
        <p className="text-muted-foreground">
          Discover the most popular and trending projects
        </p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {allProjects.slice(0, 3).length === 3 ? (
          <>
            {/* Second place */}
            <Card
              className="border-silver relative overflow-hidden border-2"
              key={`top-2-${allProjects[1]?.id}`}
            >
              <div className="absolute left-0 top-0 bg-gradient-to-r from-slate-300 to-slate-200 px-3 py-1 text-xs font-bold text-slate-700">
                #2
              </div>
              <div className="flex flex-col items-center p-6 pt-8">
                <div className="border-silver mb-4 rounded-full border-4 p-1">
                  <Image
                    height={80}
                    width={80}
                    src={allProjects[1].image || "/user.jpg"}
                    alt={allProjects[1].name}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                </div>
                <h3 className="mb-1 text-center text-lg font-bold">
                  {allProjects[1].name}
                </h3>
                <p className="mb-4 line-clamp-2 text-center text-sm text-muted-foreground">
                  {allProjects[1].description}
                </p>
                <div className="flex w-full justify-between gap-2">
                  <div className="flex flex-col items-center">
                    <GoStarFill className="mb-1 h-4 w-4 text-amber-400" />
                    <span className="text-xs font-medium">
                      {allProjects[1].stars.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <UserIcon className="mb-1 h-4 w-4 text-blue-400" />
                    <span className="text-xs font-medium">
                      {allProjects[1].follower.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Flag className="mb-1 h-4 w-4 text-red-400" />
                    <span className="text-xs font-medium">
                      {allProjects[1].review.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <PackageIcon className="mb-1 h-4 w-4 text-purple-400" />
                    <span className="text-xs font-medium">
                      {allProjects[1].update.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* First place */}
            <Card
              className="relative overflow-hidden border-2 border-amber-400 shadow-lg"
              key={`top-1-${allProjects[0]?.id}`}
            >
              <div className="absolute left-0 top-0 bg-gradient-to-r from-amber-500 to-amber-300 px-3 py-1 text-xs font-bold text-amber-900">
                #1
              </div>
              <div className="flex flex-col items-center p-6 pt-10">
                <div className="mb-4 rounded-full border-4 border-amber-400 p-1">
                  <Image
                    height={100}
                    width={100}
                    src={allProjects[0].image || "/user.jpg"}
                    alt={allProjects[0].name}
                    className="h-24 w-24 rounded-full object-cover"
                  />
                </div>
                <Trophy className="mb-2 h-6 w-6 text-amber-500" />
                <h3 className="mb-1 text-center text-xl font-bold">
                  {allProjects[0].name}
                </h3>
                <p className="mb-4 line-clamp-2 text-center text-sm text-muted-foreground">
                  {allProjects[0].description}
                </p>
                <div className="flex w-full justify-between gap-2">
                  <div className="flex flex-col items-center">
                    <GoStarFill className="mb-1 h-5 w-5 text-amber-400" />
                    <span className="text-sm font-medium">
                      {allProjects[0].stars.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <UserIcon className="mb-1 h-5 w-5 text-blue-400" />
                    <span className="text-sm font-medium">
                      {allProjects[0].follower.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Flag className="mb-1 h-5 w-5 text-red-400" />
                    <span className="text-sm font-medium">
                      {allProjects[0].review.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <PackageIcon className="mb-1 h-5 w-5 text-purple-400" />
                    <span className="text-sm font-medium">
                      {allProjects[0].update.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Third place */}
            <Card
              className="relative overflow-hidden border-2 border-amber-700"
              key={`top-3-${allProjects[2]?.id}`}
            >
              <div className="absolute left-0 top-0 bg-gradient-to-r from-amber-800 to-amber-600 px-3 py-1 text-xs font-bold text-amber-50">
                #3
              </div>
              <div className="flex flex-col items-center p-6 pt-8">
                <div className="mb-4 rounded-full border-4 border-amber-700 p-1">
                  <Image
                    height={80}
                    width={80}
                    src={allProjects[2].image || "/user.jpg"}
                    alt={allProjects[2].name}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                </div>
                <h3 className="mb-1 text-center text-lg font-bold">
                  {allProjects[2].name}
                </h3>
                <p className="mb-4 line-clamp-2 text-center text-sm text-muted-foreground">
                  {allProjects[2].description}
                </p>
                <div className="flex w-full justify-between gap-2">
                  <div className="flex flex-col items-center">
                    <GoStarFill className="mb-1 h-4 w-4 text-amber-400" />
                    <span className="text-xs font-medium">
                      {allProjects[2].stars.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <UserIcon className="mb-1 h-4 w-4 text-blue-400" />
                    <span className="text-xs font-medium">
                      {allProjects[2].follower.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <Flag className="mb-1 h-4 w-4 text-red-400" />
                    <span className="text-xs font-medium">
                      {allProjects[2].review.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col items-center">
                    <PackageIcon className="mb-1 h-4 w-4 text-purple-400" />
                    <span className="text-xs font-medium">
                      {allProjects[2].update.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
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
          <Badge variant="outline" className="bg-background">
            <GoStarFill className="mr-1 h-3 w-3 text-amber-400" /> Stars
          </Badge>
          <Badge variant="outline" className="bg-background">
            <UserIcon className="mr-1 h-3 w-3 text-blue-400" /> Followers
          </Badge>
          <Badge variant="outline" className="bg-background">
            <Flag className="mr-1 h-3 w-3 text-red-400" /> Reviews
          </Badge>
          <Badge variant="outline" className="bg-background">
            <PackageIcon className="mr-1 h-3 w-3 text-purple-400" /> Updates
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
            <Link href={`/project/${project.id}`} key={`${project.id}-${index}`}>
              <Card
                className="group flex items-center my-2 overflow-hidden border border-muted-foreground/20 p-4 transition-all hover:border-primary/20 hover:shadow-md"
              >
                <div className="mr-4 flex h-8 w-8 items-center justify-center rounded-full bg-muted font-bold">
                  {index + 1}
                </div>
                <div className="flex flex-1 items-center gap-4">
                  <Image
                    height={1200}
                    width={1200}
                    src={project.image || "/user.jpg"}
                    alt={project.name}
                    className="h-16 w-16 rounded-md object-cover object-center transition-transform group-hover:scale-105"
                  />

                  <div className="flex-1">
                    <h3 className="font-semibold">{project.name}</h3>
                    <p className="line-clamp-1 text-sm text-muted-foreground">
                      {project.description}
                    </p>
                  </div>
                </div>

                <div className="hidden grid-cols-4 gap-6 md:grid">
                  <div className="flex items-center gap-2">
                    <GoStarFill className="h-5 w-5 text-amber-400" />
                    <span className="font-medium">
                      {project.stars.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <UserIcon className="h-5 w-5 text-blue-400" />
                    <span className="font-medium">
                      {project.follower.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Flag className="h-5 w-5 text-red-400" />
                    <span className="font-medium">
                      {project.review.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PackageIcon className="h-5 w-5 text-purple-400" />
                    <span className="font-medium">
                      {project.update.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="ml-4 flex items-center gap-3 md:hidden">
                  <div className="flex items-center gap-1">
                    <GoStarFill className="h-4 w-4 text-amber-400" />
                    <span className="text-xs font-medium">
                      {project.stars.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <UserIcon className="h-4 w-4 text-blue-400" />
                    <span className="text-xs font-medium">
                      {project.follower.toLocaleString()}
                    </span>
                  </div>
                </div>
              </Card>
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
            className="w-full"
          >
            {isLoading || isFetching ? "Loading..." : "Load More Projects"}
          </Button>
        </div>
      )}
    </div>
  );
}
