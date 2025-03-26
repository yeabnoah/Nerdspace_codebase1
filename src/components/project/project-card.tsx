import { formatDistanceToNow } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
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

  return (
    <Card className="my-2 flex flex-col overflow-hidden rounded-2xl border shadow-none">
      <CardContent
        className="relative flex h-72 flex-col justify-end bg-cover p-4"
        style={{
          backgroundImage: `url(${project.image || "/placeholder.svg"})`,
        }}
      >
        <div className="absolute inset-0 mt-[50%] h-1/2 bg-gradient-to-t from-black blur via-transparent to-transparent"></div>
        <div className="relative z-10 mb-1 flex items-center justify-between text-sm text-white"></div>
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
