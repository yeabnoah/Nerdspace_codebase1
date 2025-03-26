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
    project.description.length > 100 ? `${project.description.substring(0, 100)}...` : project.description;

  return (
    <Card
      className="my-2 flex flex-col overflow-hidden rounded-2xl border shadow-lg hover:cursor-pointer"
      onClick={() => {
        router.push(`/project/${project.id}`);
      }}
    >
      <div className="relative w-full h-48 overflow-hidden">
        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.name}
          fill
          className="object-cover transition-transform hover:scale-105"
        />
        <div className="absolute top-3 left-3">
          <Badge variant="outline" className="bg-primary/20 text-primary-foreground border-primary/30">
            {project.status}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="relative w-6 h-6 rounded-full overflow-hidden">
            <Image
              src={project.user.image || "/placeholder.svg"}
              alt="test"
              fill
              className="object-cover"
            />
          </div>
          <span className="text-sm font-medium">{project.user.visualName}</span>
          <div className="flex items-center text-muted-foreground text-xs ml-auto">
            <CalendarIcon className="w-3 h-3 mr-1" />
            <span>{timeAgo}</span>
          </div>
        </div>

        <h3 className="font-bold text-lg mb-1 line-clamp-1">{project.name}</h3>
        <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{truncatedDescription}</p>

        <div className="flex flex-wrap gap-1 mb-2">
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

      <CardFooter className="p-4 pt-0 flex justify-between border-t">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm">{project._count.stars}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart className="w-4 h-4 text-red-500" />
            <span className="text-sm">{project._count.followers}</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
