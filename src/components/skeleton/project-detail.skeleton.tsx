import React from "react";
import { Skeleton } from "../ui/skeleton";

const ProjectDetailSkeleton = () => {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <Skeleton className="h-[300px] w-full md:h-[400px]" />
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <Skeleton className="h-8 w-1/4" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
        <div className="space-y-8">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailSkeleton;
