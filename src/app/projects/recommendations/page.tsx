"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LeftNavbar from "@/components/navbar/left-navbar";
import MobileNavBar from "@/components/navbar/mobile-nav-bar";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { Calendar, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type Project = {
  id: string;
  name: string;
  description: string;
  image: string;
  status: string;
  category: string[];
  members?: number;
  createdAt: string;
};

const ProjectCardSkeleton = () => {
  return (
    <div className="group relative h-[380px] w-full max-w-sm overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-100 via-white to-zinc-50 shadow-md transition-all duration-300 hover:scale-[1.02] dark:from-zinc-900 dark:via-zinc-800/10 dark:to-black border-none">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-violet-500/5 via-transparent to-emerald-500/5 opacity-0 blur-xl transition-opacity duration-700 group-hover:opacity-100 dark:from-violet-500/10 dark:to-emerald-500/10"></div>
      <div className="absolute inset-0 z-0">
        <Skeleton className="h-full w-full opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-white/40 dark:from-black dark:via-black/80 dark:to-transparent"></div>
      </div>
      <div className="relative z-10 flex h-full flex-col p-6">
        <div className="mb-auto flex w-full items-start justify-between">
          <div className="overflow-hidden rounded-xl bg-zinc-800/10 backdrop-blur-md dark:bg-white/10">
            <div className="bg-zinc-800 px-3 py-1 text-center text-[10px] font-semibold text-white dark:bg-black/60">
              <Skeleton className="h-4 w-12 opacity-40" />
            </div>
            <div className="px-3 py-1.5 text-center">
              <Skeleton className="h-6 w-6 opacity-40" />
            </div>
          </div>
          <Skeleton className="h-8 w-8 rounded-full opacity-40" />
        </div>
        <div className="mt-auto space-y-4">
          <Skeleton className="h-6 w-16 opacity-40" />
          <Skeleton className="h-8 w-3/4 opacity-40" />
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-3 w-3 opacity-40" />
            <Skeleton className="h-3 w-24 opacity-40" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-full opacity-40" />
            <Skeleton className="h-4 w-2/3 opacity-40" />
          </div>
          <Skeleton className="mt-4 h-10 w-full opacity-40" />
        </div>
      </div>
      <div className="absolute inset-0 rounded-2xl border border-zinc-200 transition-all duration-300 group-hover:border-zinc-300 dark:border-white/5 dark:group-hover:border-white/10"></div>
    </div>
  );
};

const ProjectCard = ({ project }: { project: Project }) => {
  const createdDate = project.createdAt ? new Date(project.createdAt) : new Date();
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });
  const month = createdDate.toLocaleString("default", { month: "short" }).toUpperCase();
  const day = createdDate.getDate();

  return (
    <div className="group relative h-[380px] w-full max-w-sm overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-100 via-white to-zinc-50 shadow-md transition-all duration-300 hover:scale-[1.02] dark:from-zinc-900 dark:via-zinc-800/10 dark:to-black border-none">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-violet-500/5 via-transparent to-emerald-500/5 opacity-0 blur-xl transition-opacity duration-700 group-hover:opacity-100 dark:from-violet-500/10 dark:to-emerald-500/10"></div>
      <div className="absolute inset-0 z-0">
        <Image
          src={project.image || "/placeholder.svg?height=400&width=600"}
          alt={project.name}
          fill
          className="object-cover opacity-40 transition-all duration-700 group-hover:scale-105 group-hover:opacity-50 dark:opacity-40 dark:group-hover:opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-white/40 dark:from-black dark:via-black/80 dark:to-transparent"></div>
      </div>
      <div className="relative z-10 flex h-full flex-col p-6">
        <div className="mb-auto flex w-full items-start justify-between">
          <div className="overflow-hidden rounded-xl bg-zinc-800/10 backdrop-blur-md dark:bg-white/10">
            <div className="bg-zinc-800 px-3 py-1 text-center text-[10px] font-semibold text-white dark:bg-black/60">
              {month}
            </div>
            <div className="px-3 py-1.5 text-center">
              <div className="text-lg font-bold text-zinc-800 dark:text-white">
                {day}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-auto space-y-4">
          <Badge
            variant="outline"
            className="border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
          >
            {project.status}
          </Badge>
          <h2 className="font-heading text-2xl font-instrument font-bold leading-tight text-zinc-900 dark:text-white">
            {project.name}
          </h2>
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-white/60">
            <Calendar className="h-3 w-3" />
            <span>{timeAgo}</span>
          </div>
          <p className="line-clamp-2 text-xs leading-relaxed text-zinc-600 dark:text-white/80">
            {project.description}
          </p>
          <Button
            className="mt-4 w-full gap-2 shadow-none bg-transparent text-black dark:text-white hover:bg-transparent transition-all"
            onClick={() => window.location.href = `/project/${project.id}`}
          >
            View Project
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="absolute inset-0 rounded-2xl border border-zinc-200 transition-all duration-300 group-hover:border-zinc-300 dark:border-white/5 dark:group-hover:border-white/10"></div>
    </div>
  );
};

const ProjectList = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["recommended-projects"],
    queryFn: async () => {
      const res = await axios.get<{ projects: Project[] }>("/api/project/recommendation");
      return res.data.projects;
    },
  });

  if (isError) return <p className="p-6 text-red-500">Failed to load projects.</p>;

  return (
    <div className="my-5 flex min-h-fit flex-1 flex-row items-center md:mx-10">
      <div className="container mx-auto p-4">
        <h1 className="mb-6 font-instrument text-3xl">Recommended Projects</h1>
        {!data?.length && !isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-lg text-muted-foreground">No projects found.</p>
            <p className="text-sm text-muted-foreground">
              Check back later for new recommendations.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <ProjectCardSkeleton key={i} />
                ))
              : data?.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
          </div>
        )}
      </div>
    </div>
  );
};

const ProjectRecommendationsPage = () => {
  return (
    <div className="mx-auto flex max-w-6xl flex-1 flex-row items-start">
      <LeftNavbar />
      <ProjectList />
      <MobileNavBar />
    </div>
  );
};

export default ProjectRecommendationsPage;
