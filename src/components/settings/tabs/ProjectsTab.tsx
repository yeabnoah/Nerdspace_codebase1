"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

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

function ProjectCard({ project }: { project: Project }) {
  const router = useRouter();
  const createdDate = new Date(project.createdAt);
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });
  const month = createdDate
    .toLocaleString("default", { month: "short" })
    .toUpperCase();
  const day = createdDate.getDate();
  const weekday = createdDate.toLocaleString("default", { weekday: "short" });

  return (
    <div
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
}

export default function ProjectsTab() {
  const [activeTab, setActiveTab] = useState("followed");

  const { data: followedProjects, isLoading: isLoadingFollowed } = useQuery({
    queryKey: ["followed-projects"],
    queryFn: async () => {
      const response = await axios.get("/api/users/projects");
      return response.data.data;
    },
  });

  const { data: ownedProjects, isLoading: isLoadingOwned } = useQuery({
    queryKey: ["owned-projects"],
    queryFn: async () => {
      const response = await axios.get("/api/users/projects/owned");
      return response.data.data;
    },
  });

  const isLoading = activeTab === "followed" ? isLoadingFollowed : isLoadingOwned;
  const projects = activeTab === "followed" ? followedProjects : ownedProjects;

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="followed">Followed Projects</TabsTrigger>
          <TabsTrigger value="owned">My Projects</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-[300px] animate-pulse rounded-3xl bg-gray-800/50"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects?.map((project: Project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
