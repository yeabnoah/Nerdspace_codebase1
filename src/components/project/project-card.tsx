import { formatDistanceToNow } from "date-fns";
import { Star, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import Image from "next/image";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description: string;
    status: string;
    category: string[];
    createdAt: Date;
    image?: string;
    user: {
      name: string;
      image: string;
    };
    _count: {
      stars: number;
      followers: number;
    };
  };
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const primaryCategory = project.category[0] || "Project";
  const formattedStars = project._count.stars.toLocaleString();

  return (
    <Card className="flex flex-col overflow-hidden my-2 rounded-xl border bg-card shadow-sm transition-shadow hover:shadow-md">
      <CardHeader className="relative h-32 w-full flex-shrink-0 sm:h-12">
        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.name}
          fill
          className="object-cover h-12"
        />
      </CardHeader>

      <CardContent className="flex flex-col p-4">
        <div className="mb-1 text-sm text-muted-foreground">
          {primaryCategory}
        </div>
        
        <h3 className="mb-1 text-lg font-semibold leading-tight">
          {project.name}
          <Badge
          variant="outline"
          className={`ml-auto ${
            project.status.toLowerCase() === "completed"
              ? "border-green-200 text-green-700"
              : project.status.toLowerCase() === "paused"
                ? "border-amber-200 text-amber-700"
                : "border-blue-200 text-blue-700"
          }`}
        >
          {project.status}
        </Badge>
        </h3>
        <div className="mb-2 flex items-center text-sm text-muted-foreground">
          <MapPin className="mr-1 h-3.5 w-3.5" />
          <span>
            {project.user.name},{" "}
            {formatDistanceToNow(project.createdAt, { addSuffix: true })}
          </span>
        </div>
      </CardContent>

      <CardFooter className="mt-auto flex items-center p-4">
        <div className="flex items-center">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= Math.round(project._count.stars / 10)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="ml-1 text-sm font-medium">
            {(project._count.stars / 10).toFixed(1)}
          </span>
          <span className="ml-1 text-sm text-muted-foreground">
            ({formattedStars} Reviews)
          </span>
        </div>

        
      </CardFooter>
    </Card>
  );
}
