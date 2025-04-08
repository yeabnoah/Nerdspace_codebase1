"use client";

import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import type ProjectInterface from "@/interface/auth/project.interface";
import { Share2, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProjectCard(project: ProjectInterface) {
  const router = useRouter();
  const createdDate = new Date(project.createdAt);
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });

  // Get month and day for the date badge
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
      {/* Glowing effect container */}
      <div className="absolute inset-0 z-0 animate-pulse bg-gradient-to-br from-blue-500/50 to-purple-500/50 shadow-lg blur-[3px]"></div>

      {/* Background image with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src={project.image || "/placeholder.svg?height=400&width=600"}
          alt={project.name}
          fill
          className="object-cover opacity-70 blur-[1px]"
        />
        {/* Enhanced gradient for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40"></div>
      </div>

      {/* Content container */}
      <div className="relative z-10 flex h-full flex-col p-5">
        {/* Top row with date and share button */}
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

        {/* Project title and description */}
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

        {/* Action button */}
        <button
          className="w-full rounded-xl bg-white py-2.5 text-center text-sm font-medium text-black transition-colors hover:bg-gray-100"
          onClick={(e) => {
            e.stopPropagation();
            // Add your action here
          }}
        >
          View Project
        </button>
      </div>
    </div>
  );
}
