"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Star } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProjectRecommendationSkeleton } from "./FollowListSkeleton";
import ProjectInterface from "@/interface/auth/project.interface";
import Image from "next/image";

export default function RecommendedProjects() {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery<ProjectInterface[]>({
    queryKey: ["recommended-projects"],
    queryFn: async () => {
      const res = await axios.get("/api/project/recommendation");
      return res.data.projects;
    },
  });

  if (isLoading) return <ProjectRecommendationSkeleton />;
  if (isError) return <p>Error loading users</p>;

  return (
    <Card className="hidden min-h-32 rounded-2xl border border-gray-100 bg-transparent pt-4 shadow-none dark:border-gray-500/5 md:block">
      <div className="relative">
        {/* Subtle gradient background effects */}
        <div className="absolute -right-4 size-32 -rotate-45 rounded-full border border-primary/10 bg-gradient-to-br from-primary/5 to-transparent blur-[150px] backdrop-blur-sm"></div>

        <h2
          onClick={() => {
            router.push("/projects/recommendations");
          }}
          className="mb-3 px-6 font-instrument text-2xl italic text-card-foreground hover:cursor-pointer hover:underline dark:text-white"
        >
          Projects to follow
        </h2>
        <CardContent className="flex flex-col space-y-3 px-2">
          {data && data.length == 0 && (
            <div className="flex flex-1 flex-col">
              <div className="flex items-center justify-between">
                <p className="text-sm font-geist text-center my-5 hover:underline">
                  no projects to recommend
                </p>
              </div>
            </div>
          )}
          {data &&
            data.slice(0, 3).map((each, index: number) => (
              <Link
                key={index}
                href={`/project/${each.id}`}
                className="group relative flex flex-row items-center gap-3 rounded-xl border border-gray-100/50 bg-gray-500/5 p-2 transition-all duration-300 dark:border-gray-500/5"
              >
                <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-white/10">
                  <Image
                    height={200}
                    width={200}
                    src={each.image}
                    alt={`${each.name} image`}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-center justify-between">
                    <p
                      className="text-sm font-medium hover:underline"
                      title={each.name}
                    >
                      {each.name.length > 15
                        ? `${each.name.substring(0, 15)}...`
                        : each.name}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="h-3 w-3 text-yellow-500" />
                    <p className="text-xs text-muted-foreground">
                      {each.members?.toLocaleString() ?? 0} members
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  className="rounded-full border bg-transparent text-card-foreground shadow-none hover:bg-transparent dark:text-white"
                >
                  Follow
                </Button>
              </Link>
            ))}
        </CardContent>
      </div>
    </Card>
  );
}
