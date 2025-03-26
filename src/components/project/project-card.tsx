import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import Image from "next/image";
import ProjectInterface from "@/interface/auth/project.interface";
import { Star, Heart, CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProjectCard(project: ProjectInterface) {
  const primaryCategory = project.category[0] || "Project";
  const router = useRouter();
  const createdDate = new Date(project.createdAt);
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });

  // Truncate description to 100 characters
  const truncatedDescription =
    project.description.length > 100
      ? `${project.description.substring(0, 100)}...`
      : project.description;

  return (
    <Card
      className="my-2 flex flex-col overflow-hidden rounded-lg border shadow-none hover:cursor-pointer dark:border-gray-500/5"
      onClick={() => {
        router.push(`/project/${project.id}`);
      }}
    >
      <div className="relative h-20 w-full overflow-hidden bg-black">
        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.name}
          fill
          className="object-cover opacity-50 transition-transform hover:scale-105 dark:opacity-10"
        />
        <div className="absolute left-3 top-3 flex w-[90%] flex-row items-center justify-between">
          <Badge
            variant="outline"
            className="border-white/15 text-white dark:border-primary/5 dark:text-white"
          >
            {project.status}
          </Badge>

          <div className="flex items-center gap-1">
            <div className="flex items-center gap-1">
              <span className="text-base font-medium text-yellow-500">
                {project._count.stars}
              </span>
              <Star className="h-4 w-4 text-yellow-500" />
            </div>
            <div className="ml-2 flex items-center gap-1">
              <span className="text-base font-medium text-red-500">
                {project._count.followers}
              </span>
              <Heart className="h-4 w-4 text-red-500" />
            </div>
          </div>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="mb-2 flex items-center gap-2">
          <div className="relative h-6 w-6 overflow-hidden rounded-full">
            <Image
              src={project.user.image || "/placeholder.svg"}
              alt="test"
              fill
              className="object-cover"
            />
          </div>
          <span className="text-sm font-medium">{project.user.visualName}</span>
          <div className="ml-auto flex items-center text-xs text-muted-foreground">
            <CalendarIcon className="mr-1 h-3 w-3" />
            <span>{timeAgo}</span>
          </div>
        </div>

        <h3 className="mb-1 line-clamp-1 text-lg font-medium">
          {project.name}
        </h3>
        <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
          {truncatedDescription}
        </p>

        <div className="mb-2 flex flex-wrap gap-1">
          {project.category.slice(0, 3).map((cat) => (
            <Badge key={cat} variant="secondary" className="text-xs">
              {cat}
            </Badge>
          ))}
          {project.category.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{project.category.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
