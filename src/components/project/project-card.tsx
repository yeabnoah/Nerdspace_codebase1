"use client";

import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Calendar, ArrowRight, Share2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type ProjectInterface from "@/interface/auth/project.interface";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

export default function ProjectCard(project: ProjectInterface) {
  const router = useRouter();
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const session = authClient.useSession();

  const postAsPostMutation = useMutation({
    mutationKey: ["postaspost", project.id],
    mutationFn: async () => {
      const response = await axios.post(
        `/api/project/update/share`,
        {
          content:
            project?.userId === session.data?.user.id
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

  // Get month and day for the date badge
  const month = createdDate
    .toLocaleString("default", { month: "short" })
    .toUpperCase();
  const day = createdDate.getDate();

  return (
    <div
      className="group relative h-[380px] w-full max-w-sm overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-100 via-white to-zinc-50 shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-xl dark:from-zinc-900 dark:via-zinc-800 dark:to-black"
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

          {/* Share button with hover effect */}
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

        {/* Project details with improved typography */}
        <div className="mt-auto space-y-4">
          {/* Status badge */}
          <Badge
            variant="outline"
            className="border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
          >
            Active
          </Badge>

          {/* Title with better typography */}
          <h2 className="font-heading text-2xl font-instrument font-bold leading-tight text-zinc-900 dark:text-white">
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
            className="mt-4 w-full gap-2 shadow-none bg-transparent text-black dark:text-white hover:bg-transparent transition-all"
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
              <div className="font-geist mb-2 text-3xl font-medium">
                Share Project
              </div>
              <p className="font-geist mb-6 text-muted-foreground">
                Are you sure you want to share this project? This will make it visible to others.
              </p>

              <div className="font-geist mt-8 flex justify-end gap-3 border-t pt-4 dark:border-gray-500/5">
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
