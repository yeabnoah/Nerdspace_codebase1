import React from "react";
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

const UserListSkeleton: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, index) => (
          <Card
            key={index}
            className="overflow-hidden rounded-2xl border border-zinc-200 bg-white/80 shadow-sm dark:border-zinc-800/50 dark:bg-black/80 backdrop-blur-sm"
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Skeleton className="h-16 w-16 rounded-full" />
                </div>
                <div className="min-w-0 flex-1 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
              <Skeleton className="mt-3 h-4 w-full" />
              <Skeleton className="mt-2 h-4 w-3/4" />
              <Skeleton className="mt-4 h-12 w-full rounded-full" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Skeleton className="mt-6 h-12 w-full rounded-full" />
    </div>
  );
};

export default UserListSkeleton;
