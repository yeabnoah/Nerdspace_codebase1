"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { GoStarFill } from "react-icons/go";
import Image from "next/image";

interface ProjectRankingResponse {
  projects: {
    id: string;
    image: string;
    name: string;
    description: string;
    stars: number;
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

  return (
    <div className="mx-auto flex w-full flex-col rounded-lg bg-background px-5 pb-8 shadow-md">
      <div className="space-y-4">
        {data?.pages?.flatMap((page) => page.projects)?.length ? (
          data.pages
            .flatMap((page) => page.projects)
            .map((project) => (
              <Card
                key={project.id}
                className="flex items-center justify-between overflow-hidden rounded-md border border-muted-foreground/20 p-4 transition-all hover:shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <Image
                    height={200}
                    width={200}
                    src={project.image || "/user.jpg"}
                    alt={project.name}
                    className="h-16 w-16 rounded-md object-cover"
                  />
                  <div>
                    <h3 className="text-sm font-semibold">{project.name}</h3>
                    <p className="line-clamp-2 text-xs text-muted-foreground">
                      {project.description}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <Button variant="ghost" size="icon" className="mb-1">
                    <GoStarFill className="h-5 w-5" />
                  </Button>
                  <span className="text-sm font-medium">
                    {project.stars.toLocaleString()}
                  </span>
                </div>
              </Card>
            ))
        ) : (
          <p className="text-center text-muted-foreground">
            No projects available.
          </p>
        )}
      </div>

      {hasNextPage && (
        <div className="mt-6 flex justify-center">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={isLoading || isFetching}
            className="w-full"
          >
            {isLoading || isFetching ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}
