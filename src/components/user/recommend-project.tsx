"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ProjectRecommendationSkeleton } from "./FollowListSkeleton";

export default function RecommendedProjects() {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
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
      <h2
        onClick={() => {
          router.push("/projects/recommendations");
        }}
        className="mb-3 px-6 font-instrument text-2xl italic text-card-foreground hover:cursor-pointer hover:underline dark:text-white"
      >
        Projects to follow
      </h2>
      <CardContent className="flex flex-col">
        {data.map((each: any, index: number) => (
          <Link
            key={index}
            href={`/project/${each.id}`}
            className="flex flex-row items-center gap-2 rounded-lg py-2 transition hover:bg-muted"
          >
            <img
              src={each.image}
              alt={`${each.name} image`}
              className="h-10 w-10 rounded-full"
            />
            <div>
              <p
                className="text-sm font-medium hover:underline"
                title={each.name}
              >
                {each.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {each.members?.toLocaleString() ?? 0} members
              </p>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
