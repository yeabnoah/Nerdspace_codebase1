import React from "react";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

const RenderPostSkeleton = () => {
  return (
    <div>
      <Card className="my-5 rounded-xl border bg-transparent p-4 shadow-none">
        <div className="flex items-center gap-5">
          <Skeleton className="size-10 rounded-full" />
          <div>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-1 h-3 w-16" />
          </div>
        </div>
        <Skeleton className="mt-4 h-16 w-full" />
        <div className="mt-4 flex gap-3">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      </Card>
      <Card className="my-5 rounded-xl border bg-transparent p-4 shadow-none">
        <div className="flex items-center gap-5">
          <Skeleton className="size-10 rounded-full" />
          <div>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-1 h-3 w-16" />
          </div>
        </div>
        <Skeleton className="mt-4 h-16 w-full" />
        <div className="mt-4 flex gap-3">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      </Card>
      <Card className="my-5 rounded-xl border bg-transparent p-4 shadow-none">
        <div className="flex items-center gap-5">
          <Skeleton className="size-10 rounded-full" />
          <div>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-1 h-3 w-16" />
          </div>
        </div>
        <Skeleton className="mt-4 h-16 w-full" />
        <div className="mt-4 flex gap-3">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      </Card>
    </div>
  );
};

export default RenderPostSkeleton;
