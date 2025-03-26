import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function ProjectCardSkeleton() {
  return (
    <Card className="my-2 flex flex-col overflow-hidden rounded-2xl border shadow-none">
      <CardContent className="relative flex gap-2 h-64 flex-col justify-end p-4">
        <Skeleton className=" h-40" />
        <Skeleton className=" h-12" />
      </CardContent>
    </Card>
  );
}
