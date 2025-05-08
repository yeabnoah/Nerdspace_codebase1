"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import type ProjectInterface from "@/interface/auth/project.interface";
import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight, Calendar, Share2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ProjectCard({ project, onUpdate, onDelete }: { project: ProjectInterface; onUpdate: () => void; onDelete: () => void }) {
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
      className="group relative bg-gradient-to-br from-zinc-100 dark:from-zinc-900 via-white dark:via-zinc-800/10 to-zinc-50 dark:to-black shadow-md border-none rounded-2xl w-full max-w-sm h-[380px] overflow-hidden hover:scale-[1.02] transition-all duration-300"
      onClick={() => router.push(`/project/${project.id}`)}
    >
      {/* Subtle animated glow effect */}
      <div className="z-0 absolute inset-0 bg-gradient-to-br from-violet-500/5 dark:from-violet-500/10 via-transparent to-emerald-500/5 dark:to-emerald-500/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700"></div>

      {/* Background image with improved overlay */}
      <div className="z-0 absolute inset-0">
        <Image
          src={project.image || "/placeholder.svg?height=400&width=600"}
          alt={project.name}
          fill
          className="opacity-40 dark:group-hover:opacity-50 dark:opacity-40 group-hover:opacity-50 object-cover group-hover:scale-105 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-black via-white/80 dark:via-black/80 to-white/40 dark:to-transparent"></div>
      </div>

      {/* Content container with better spacing */}
      <div className="z-10 relative flex flex-col p-6 h-full">
        {/* Top section with date badge and share button */}
        <div className="flex justify-between items-start mb-auto w-full">
          {/* Modern date badge */}
          <div className="bg-zinc-800/10 dark:bg-white/10 backdrop-blur-md rounded-xl overflow-hidden">
            <div className="bg-zinc-800 dark:bg-black/60 px-3 py-1 font-semibold text-[10px] text-white text-center">
              {month}
            </div>
            <div className="px-3 py-1.5 text-center">
              <div className="font-bold text-zinc-800 dark:text-white text-lg">
                {day}
              </div>
            </div>
          </div>

          {/* Share button with hover effect */}
          <button
            className="bg-zinc-800/10 hover:bg-zinc-800/20 dark:bg-white/10 dark:hover:bg-white/20 backdrop-blur-md p-2 rounded-full text-zinc-600 hover:text-zinc-800 dark:hover:text-white dark:text-white/70 transition-all"
            onClick={(e) => {
              e.stopPropagation();
              setIsShareDialogOpen(true);
            }}
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>

        {/* Project details with improved typography */}
        <div className="space-y-4 mt-auto">
          {/* Status badge */}
          <Badge
            variant="outline"
            className="bg-emerald-500/10 border-emerald-500/50 text-emerald-700 dark:text-emerald-400"
          >
            Active
          </Badge>

          {/* Title with better typography */}
          <h2 className="font-heading font-instrument font-bold text-zinc-900 dark:text-white text-2xl leading-tight">
            {project.name}
          </h2>

          {/* Timestamp with icon */}
          <div className="flex items-center gap-1.5 text-zinc-500 dark:text-white/60 text-xs">
            <Calendar className="w-3 h-3" />
            <span>{timeAgo}</span>
          </div>

          {/* Description with better readability */}
          <p className="text-zinc-600 dark:text-white/80 text-xs line-clamp-2 leading-relaxed">
            {project.description}
          </p>

          {/* Action button with hover effect */}
          <Button
            className="gap-2 bg-transparent hover:bg-transparent shadow-none mt-4 w-full text-black dark:text-white transition-all"
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/project/${project.id}`);
            }}
          >
            View Project
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Subtle border glow on hover */}
      <div className="absolute inset-0 border border-zinc-200 dark:border-white/5 dark:group-hover:border-white/10 group-hover:border-zinc-300 rounded-2xl transition-all duration-300"></div>

      {/* Share Project Dialog */}
      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="backdrop-blur-sm p-0 border-none rounded-xl max-w-md overflow-hidden">
          <DialogTitle></DialogTitle>
          <div className="relative flex flex-col">
            {/* Glow effects */}
            <div className="-right-4 absolute bg-gradient-to-br from-primary/40 via-primary/50 to-transparent backdrop-blur-sm blur-[150px] border border-primary/50 rounded-full size-32 -rotate-45"></div>
            <div className="-bottom-5 left-12 absolute bg-gradient-to-tl from-secondary/40 via-secondary/30 to-transparent backdrop-blur-sm blur-[150px] border border-secondary/50 rounded-full size-32 rotate-45"></div>

            <div className="flex flex-col px-6 pb-3 w-full">
              <div className="mb-2 font-geist font-medium text-3xl">
                Share Project
              </div>
              <p className="mb-6 font-geist text-muted-foreground">
                Are you sure you want to share this project? This will make it visible to others.
              </p>

              <div className="flex justify-end gap-3 mt-8 pt-4 dark:border-gray-500/5 border-t font-geist">
                <Button
                  variant="outline"
                  className="rounded-2xl w-24 h-11"
                  onClick={() => setIsShareDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    await postAsPostMutation.mutate();
                  }}
                  className="rounded-2xl w-24 h-11"
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
