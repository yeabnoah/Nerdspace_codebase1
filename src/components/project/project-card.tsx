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
        className="relative flex h-64 flex-col justify-end bg-cover p-4"
        style={{
          backgroundImage: `url(${project.image || "/placeholder.svg"})`,
        }}
      >
        <div
          className="absolute inset-0 h-full bg-gradient-to-t from-black via-black/50 to-transparent"
          style={{ filter: "blur(8px)" }}
        ></div>
        <div className="absolute top-0 z-10 w-full mt-2 flex flex-row items-center justify-between text-sm text-white">
          <span className="flex items-center">
            <svg
              className={`h-4 w-4 fill-current text-white`}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.4 8.168L12 18.896l-7.334 3.869 1.4-8.168L.132 9.21l8.2-1.192z" />
            </svg>
            <span className="ml-1">{project._count.stars}</span>
          </span>

          <Badge variant="secondary" className=" text-xs mr-6">{project.status}</Badge>
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
