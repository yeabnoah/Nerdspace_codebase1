import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import ProjectInterface from "@/interface/auth/project.interface";
import { StarHalf } from "lucide-react";
import { GoStarFill } from "react-icons/go";

export default function ProjectCard(project: ProjectInterface) {
  const primaryCategory = project.category[0] || "Project";

  return (
    <Card className="my-2 flex flex-col overflow-hidden rounded-2xl border shadow-lg">
      <CardContent
        className="relative flex h-64 flex-col justify-end bg-cover p-4"
        style={{
          backgroundImage: `url(${project.image || "/placeholder.svg"})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
        <div className="absolute top-0 z-10 mt-2 flex w-full flex-row items-center justify-between text-sm text-white">
          <span className="flex items-center">
            <GoStarFill className="text-yellow-400" />
            <span className="ml-1">{project._count.stars}</span>
          </span>
          <Badge variant="secondary" className="mr-6 text-xs">
            {project.status}
          </Badge>
        </div>
        <h3 className="relative z-10 mb-1 text-center font-instrument text-4xl leading-tight text-white">
          {project.name}
        </h3>
        <h3 className="relative z-10 mb-2 flex items-center justify-center text-center text-xs text-white">
          started {formatDistanceToNow(project.createdAt, { addSuffix: true })}
        </h3>
      </CardContent>
    </Card>
  );
}
