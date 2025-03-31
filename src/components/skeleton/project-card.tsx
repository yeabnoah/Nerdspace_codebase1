import { Card, CardContent } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export function ProjectCardSkeleton() {
  return (
    <Card className="my-2 flex flex-col overflow-hidden rounded-2xl border shadow-none">
      <CardContent className="relative flex h-64 flex-col justify-end gap-2 p-4">
        <Skeleton className="h-56" />
        <Skeleton className="h-12" />
      </CardContent>
    </Card>
  );
}
