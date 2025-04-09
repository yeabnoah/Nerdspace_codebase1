"use client";

import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Share2, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";

interface Project {
  id: string;
  name: string;
  description: string;
  image: string;
  status: string;
  category: string[];
  access: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    image: string;
  };
}

export default function FollowedProjects() {
  const router = useRouter();
  const [cursor, setCursor] = useState<string | null>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["followed-projects"],
    queryFn: async ({ pageParam }) => {
      const response = await axios.get(`/api/users/projects?cursor=${pageParam}&limit=10`);
      return response.data;
    },
    getNextPageParam: (lastPage) => lastPage.pagination.nextCursor,
    initialPageParam: null,
  });

  const projects = data?.pages.flatMap((page) => page.data) || [];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-[300px] animate-pulse rounded-3xl bg-gray-800/50"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project: Project) => {
          const createdDate = new Date(project.createdAt);
          const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });
          const month = createdDate
            .toLocaleString("default", { month: "short" })
            .toUpperCase();
          const day = createdDate.getDate();
          const weekday = createdDate.toLocaleString("default", { weekday: "short" });

          return (
            <div
              key={project.id}
              onClick={() => router.push(`/project/${project.id}`)}
              className="group relative w-full max-w-[340px] overflow-hidden rounded-3xl bg-gradient-to-b from-gray-800 to-black shadow-lg transition-all duration-300 hover:cursor-pointer hover:shadow-xl"
            >
              <div className="absolute inset-0 z-0 animate-pulse bg-gradient-to-br from-blue-500/50 to-purple-500/50 shadow-lg blur-[3px]"></div>

              <div className="absolute inset-0 z-0">
                <Image
                  src={project.image || "/placeholder.svg?height=400&width=600"}
                  alt={project.name}
                  fill
                  className="object-cover opacity-70 blur-[1px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40"></div>
              </div>

              <div className="relative z-10 flex h-full flex-col p-5">
                <div className="mb-auto flex w-full items-end justify-end">
                  <div className="overflow-hidden rounded-lg bg-white/10 backdrop-blur-sm">
                    <div className="bg-black/80 px-3 py-0.5 text-center text-[10px] font-bold text-white">
                      {month}
                    </div>
                    <div className="px-3 py-1 text-center">
                      <div className="text-sm font-bold text-white">{day}</div>
                      <div className="text-[9px] text-white/80">{weekday}</div>
                    </div>
                  </div>
                </div>

                <div className="mb-5 mt-auto space-y-3">
                  <h2 className="font-instrument text-2xl leading-tight text-white">
                    {project.name}
                  </h2>

                  <div className="flex items-center gap-1 text-xs text-white/70">
                    <Calendar className="h-3 w-3" />
                    <span>{timeAgo}</span>
                  </div>

                  <p className="line-clamp-3 text-xs leading-relaxed text-white/90">
                    {project.description}
                  </p>
                </div>

                <button
                  className="w-full rounded-xl bg-white py-2.5 text-center text-sm font-medium text-black transition-colors hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/project/${project.id}`);
                  }}
                >
                  View Project
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {hasNextPage && (
        <div className="flex justify-center">
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="mt-4"
          >
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
} 