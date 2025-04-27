"use client";

import { ProjectCardSkeleton } from "@/components/skeleton/project-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useSession } from "@/lib/auth-client";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight, Calendar, Share2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import useUserProfileStore from "@/store/userProfile.store";

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
  _count?: {
    stars: number;
    followers: number;
    reviews: number;
    updates: number;
  };
}

function ProjectCard({ project }: { project: Project }) {
  const router = useRouter();
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const session = useSession();

  const postAsPostMutation = useMutation({
    mutationKey: ["postaspost", project.id],
    mutationFn: async () => {
      const response = await axios.post(
        `/api/project/update/share`,
        {
          content:
            project?.user.id === session?.data?.user?.id
              ? "This is my project and I'd like to share it with you"
              : "I saw this project and wanted to share it :)",
          fileUrls: [],
          projectId: project.id,
        },
        { withCredentials: true },
      );

      return response.data.data;
    },
    onSuccess: () => {
      toast.success("Project shared successfully!");
      setIsShareDialogOpen(false);
    },
    onError: () => {
      toast.error("Error occurred while trying to share project");
    },
  });

  const createdDate = new Date(project.createdAt);
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });
  const month = createdDate
    .toLocaleString("default", { month: "short" })
    .toUpperCase();
  const day = createdDate.getDate();

  return (
    <div
      className="group relative h-[380px] w-full max-w-sm overflow-hidden rounded-2xl border-none bg-gradient-to-br from-zinc-100 via-white to-zinc-50 shadow-md transition-all duration-300 hover:scale-[1.02] dark:from-zinc-900 dark:via-zinc-800/10 dark:to-black"
      onClick={() => router.push(`/project/${project.id}`)}
    >
      {/* Subtle animated glow effect */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-violet-500/5 via-transparent to-emerald-500/5 opacity-0 blur-xl transition-opacity duration-700 group-hover:opacity-100 dark:from-violet-500/10 dark:to-emerald-500/10"></div>

      {/* Background image with improved overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={project.image || "/placeholder.svg?height=400&width=600"}
          alt={project.name}
          fill
          className="object-cover opacity-40 transition-all duration-700 group-hover:scale-105 group-hover:opacity-50 dark:opacity-40 dark:group-hover:opacity-50"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-white/40 dark:from-black dark:via-black/80 dark:to-transparent"></div>
      </div>

      {/* Content container with better spacing */}
      <div className="relative z-10 flex h-full flex-col p-6">
        {/* Top section with date badge and share button */}
        <div className="mb-auto flex w-full items-start justify-between">
          {/* Modern date badge */}
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

          <button
            className="rounded-full bg-zinc-800/10 p-2 text-zinc-600 backdrop-blur-md transition-all hover:bg-zinc-800/20 hover:text-zinc-800 dark:bg-white/10 dark:text-white/70 dark:hover:bg-white/20 dark:hover:text-white"
            onClick={(e) => {
              e.stopPropagation();
              setIsShareDialogOpen(true);
            }}
          >
            <Share2 className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-auto space-y-4">
          {/* Status badge */}
          <Badge
            variant="outline"
            className="border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
          >
            {project.status}
          </Badge>

          {/* Title with better typography */}
          <h2 className="font-heading font-instrument text-2xl font-bold leading-tight text-zinc-900 dark:text-white">
            {project.name}
          </h2>

          {/* Timestamp with icon */}
          <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-white/60">
            <Calendar className="h-3 w-3" />
            <span>{timeAgo}</span>
          </div>

          {/* Description with better readability */}
          <p className="line-clamp-2 text-xs leading-relaxed text-zinc-600 dark:text-white/80">
            {project.description}
          </p>

          {/* Action button with hover effect */}
          <Button
            className="mt-4 w-full gap-2 bg-transparent text-black shadow-none transition-all hover:bg-transparent dark:text-white"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/project/${project.id}`);
            }}
          >
            View Project
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Subtle border glow on hover */}
      <div className="absolute inset-0 rounded-2xl border border-zinc-200 transition-all duration-300 group-hover:border-zinc-300 dark:border-white/5 dark:group-hover:border-white/10"></div>

      {/* Share Project Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="max-w-md overflow-hidden rounded-xl border-none p-0 backdrop-blur-sm">
          <DialogTitle></DialogTitle>
          <div className="relative flex flex-col">
            {/* Glow effects */}
            <div className="absolute -right-4 size-32 -rotate-45 rounded-full border border-primary/50 bg-gradient-to-br from-primary/40 via-primary/50 to-transparent blur-[150px] backdrop-blur-sm"></div>
            <div className="absolute -bottom-5 left-12 size-32 rotate-45 rounded-full border border-secondary/50 bg-gradient-to-tl from-secondary/40 via-secondary/30 to-transparent blur-[150px] backdrop-blur-sm"></div>

            <div className="flex w-full flex-col px-6 pb-3">
              <div className="mb-2 font-geist text-3xl font-medium">
                Share Project
              </div>
              <p className="mb-6 font-geist text-muted-foreground">
                Are you sure you want to share this project? This will make it
                visible to others.
              </p>

              <div className="mt-8 flex justify-end gap-3 border-t pt-4 font-geist dark:border-gray-500/5">
                <Button
                  variant="outline"
                  className="h-11 w-24 rounded-2xl"
                  onClick={() => setIsShareDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    await postAsPostMutation.mutate();
                  }}
                  className="h-11 w-24 rounded-2xl"
                >
                  Share
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function UserProjectsTab() {
  const { userProfile } = useUserProfileStore();

  const { data: userProjects, isLoading } = useQuery({
    queryKey: ["user-projects", userProfile?.id],
    queryFn: async () => {
      if (!userProfile?.id) return [];
      
      const response = await axios.get(`/api/users/${userProfile.id}/projects`);
      return response.data.data;
    },
    enabled: !!userProfile?.id,
  });

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      ) : userProjects?.length === 0 ? (
        <div className="flex h-[200px] w-full items-center justify-center rounded-lg border border-dashed border-zinc-200 bg-zinc-50/50 dark:border-zinc-800 dark:bg-zinc-900/50">
          <div className="text-center">
            <p className="text-lg font-medium text-zinc-600 dark:text-zinc-400">
              No projects yet
            </p>
            <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">
              This user hasn&apos;t created any projects yet
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {userProjects?.map((project: Project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
} 