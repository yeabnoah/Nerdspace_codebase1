"use client";

import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import type ProjectInterface from "@/interface/auth/project.interface";
import { Star, Heart, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function ProjectCard(project: ProjectInterface) {
  const router = useRouter();
  const createdDate = new Date(project.createdAt);
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });

  // Truncate description to 100 characters
  const truncatedDescription =
    project.description.length > 100
      ? `${project.description.substring(0, 100)}...`
      : project.description;

  const getStatusIndicator = (status: string) => {
    switch (status.toUpperCase()) {
      case "ONGOING":
        return "bg-blue-500";
      case "COMPLETED":
        return "bg-green-500";
      case "PAUSED":
        return "bg-amber-500";
      case "CANCELLED":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div
      onClick={() => router.push(`/project/${project.id}`)}
      className="group relative flex w-[275px] flex-col overflow-hidden rounded-md border border-border bg-background transition-all duration-200 hover:cursor-pointer my-1"
    >
      {/* <div
        className={cn(
          "absolute left-0 top-0 z-10 h-full w-[3px]",
          getStatusIndicator(project.status),
        )}
      ></div> */}

      <div className="relative h-12 w-full overflow-hidden border-b border-border">
        <Image
          src={project.image || "/placeholder.svg?height=400&width=600"}
          alt={project.name}
          fill
          className="object-cover grayscale filter transition-all duration-300 opacity-100"
        />

        <div className="absolute inset-0 dark:bg-black opacity-70"></div>

        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.05)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20"></div>

        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-3 rounded-sm px-2 py-1 backdrop-blur-sm dark:bg-black/80">
          <div className="flex items-center gap-1">
            <Star className="h-3.5 w-3.5 text-white" />
            <span className="text-xs font-medium text-white">{project._count.stars}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5 text-white" />
            <span className="text-xs font-medium text-white">
              {project._count.followers}
            </span>
          </div>
        </div>

        <div className="absolute left-4 top-3 z-10">
          <Badge
            variant="outline"
            className="rounded-sm text-white border-none px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide backdrop-blur-sm dark:bg-black/80"
          >
            {project.status}
          </Badge>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5 pl-6">
        <div className="mb-2">
          <div className="flex items-center justify-between">
            <h3 className="line-clamp-1 text-lg font-semibold tracking-tight">
              {project.name}
            </h3>
            <Badge
              variant={project.access === "public" ? "outline" : "secondary"}
              className="ml-2 rounded-sm px-1.5 py-0 text-[10px] font-medium uppercase"
            >
              {project.access}
            </Badge>
          </div>
          <div className="mt-1 flex items-center text-xs text-muted-foreground">
            <Clock className="mr-1 h-3 w-3" />
            <span>{timeAgo}</span>
          </div>
        </div>

        <p className="mb-4 line-clamp-2 text-xs text-muted-foreground">
          {truncatedDescription}
        </p>

        <div className="mb-2 flex flex-wrap gap-1.5">
          {project.category.slice(0, 3).map((cat) => (
            <Badge
              key={cat}
              variant="outline"
              className="rounded-sm border-border bg-background/80 px-1.5 py-0 text-[8px] font-medium uppercase tracking-wide"
            >
              {cat}
            </Badge>
          ))}
          {project.category.length > 3 && (
            <Badge
              variant="outline"
              className="rounded-sm border-border bg-background/80 px-1.5 py-0 text-[8px] font-medium uppercase tracking-wide"
            >
              +{project.category.length - 3}
            </Badge>
          )}
        </div>

        <div className="mt-auto flex items-center border-t pt-2">
          <div className="flex items-center gap-2">
            <div className="relative h-5 w-5 overflow-hidden rounded-full">
              <Image
                src={
                  project.user.image || "/placeholder.svg?height=50&width=50"
                }
                alt={project.user.visualName || "User"}
                fill
                className="object-cover"
              />
            </div>
            <span className="text-xs font-medium">
              {project.user.visualName}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
