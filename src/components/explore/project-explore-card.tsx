"use client";

import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import type ProjectInterface from "@/interface/auth/project.interface";
import { Share2, Calendar, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export default function ProjectExploreCard(project: ProjectInterface) {
  const router = useRouter();
  const createdDate = new Date(project.createdAt);
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });

  const handleProjectClick = useCallback(() => {
    router.push(`/project/${project.id}`);
  }, [router, project.id]);

  const handleViewProjectClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/project/${project.id}`);
  }, [router, project.id]);

  return (
    <div
      onClick={handleProjectClick}
      className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-b from-gray-800 to-black shadow-lg transition-all duration-300 hover:cursor-pointer hover:shadow-xl"
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
      <div className="relative z-10 flex h-full flex-col p-4">
        {/* Project title and description */}
        <div className="mb-3 space-y-2">
          <h2 className="font-instrument text-xl leading-tight text-white">
            {project.name}
          </h2>

          <div className="flex items-center gap-2 text-xs text-white/70">
            <Calendar className="h-3 w-3" />
            <span>{timeAgo}</span>
            {project.members && project.members.length > 0 && (
              <>
                <Users className="h-3 w-3" />
                <span>{project.members.length} members</span>
              </>
            )}
          </div>

          <p className="line-clamp-2 text-xs leading-relaxed text-white/90">
            {project.description}
          </p>
        </div>

        {/* Tags and action button */}
        <div className="mt-auto space-y-2">
          {project.tags && project.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {project.tags.slice(0, 3).map((tag: string, index: number) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="bg-white/10 text-white/90 backdrop-blur-sm"
                >
                  {tag}
                </Badge>
              ))}
              {project.tags.length > 3 && (
                <Badge
                  variant="secondary"
                  className="bg-white/10 text-white/90 backdrop-blur-sm"
                >
                  +{project.tags.length - 3}
                </Badge>
              )}
            </div>
          )}

          <button
            className="w-full rounded-xl bg-white py-2 text-center text-sm font-medium text-black transition-colors hover:bg-gray-100"
            onClick={handleViewProjectClick}
          >
            View Project
          </button>
        </div>
      </div>
    </div>
  );
} 