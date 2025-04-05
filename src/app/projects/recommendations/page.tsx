"use client";

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import MobileNavBar from "@/components/navbar/mobile-nav-bar";
import LeftNavbar from "@/components/navbar/left-navbar";

type Project = {
  id: string;
  name: string;
  description: string;
  image: string;
  status: string;
  category: string[];
  members?: number;
};

type ApiResponse = {
  projects: Project[];
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalProjects: number;
  };
};

export default function ProjectRecommendationsPage() {
  const fetchProjects = async ({ pageParam = 1 }: { pageParam?: number }) => {
    const res = await axios.get<ApiResponse>("/api/project/recommendation", {
      params: { page: pageParam, pageSize: 3 },
    });
    return res.data;
  };

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["recommended-projects"],
    queryFn: fetchProjects,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { currentPage, totalPages } = lastPage.pagination;
      return currentPage < totalPages ? currentPage + 1 : undefined;
    },
  });

  if (isLoading) return <p className="p-6">Loading projects...</p>;
  if (isError)
    return <p className="p-6 text-red-500">Failed to load projects.</p>;

  return (
    <div className="mx-auto flex max-w-6xl flex-1 flex-row items-start">
      <LeftNavbar />
      <div className="my-5 flex min-h-fit flex-1 flex-row items-center md:mx-10">
        <div className="container mx-auto p-4">
          <h1 className="mb-6 font-instrument text-3xl">
            Recommended Projects
          </h1>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {data?.pages.map((page, pageIndex) =>
              page.projects.map((project: Project) => (
                <Card
                  key={`${pageIndex}-${project.id}`}
                  className="p-4 transition-shadow hover:shadow-lg"
                >
                  <Link href={`/project/${project.id}`}>
                    <div className="flex flex-col gap-4">
                      <img
                        src={project.image}
                        alt={`${project.name} image`}
                        className="h-40 w-full rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-lg font-medium hover:underline">
                          {project.name}
                        </p>
                        <p className="line-clamp-3 text-sm text-muted-foreground">
                          {project.description}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {project.category.map((cat, idx) => (
                          <span
                            key={idx}
                            className="rounded-full bg-gray-200 px-2 py-1 text-xs text-gray-700 dark:bg-gray-700 dark:text-gray-300"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {project.members?.toLocaleString() ?? 0} members
                      </p>
                    </div>
                  </Link>
                </Card>
              )),
            )}
          </div>
          {hasNextPage && (
            <div className="flex justify-center">
              <button
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="mt-6 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:opacity-50"
              >
                {isFetchingNextPage ? "Loading more..." : "Load More"}
              </button>
            </div>
          )}
        </div>
      </div>
      <MobileNavBar />
    </div>
  );
}
