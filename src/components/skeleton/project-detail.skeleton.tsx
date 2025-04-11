import React from "react";
import { Skeleton } from "../ui/skeleton";

const ProjectDetailSkeleton = () => {
  return (
    <div className="container relative mx-auto pb-8">
      {/* Hero Image Section */}
      <div className="group relative mb-12 h-[400px] w-full overflow-hidden rounded-2xl shadow-lg md:h-[300px]">
        <Skeleton className="h-full w-full" />
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-zinc-900/90 via-zinc-900/60 to-transparent p-8 dark:from-black/80 dark:via-black/50">
          <div className="relative z-10 mb-4 flex items-center gap-3">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
          </div>
          <Skeleton className="relative z-10 mb-4 h-12 w-3/4" />
          <div className="relative z-10 flex items-center gap-4">
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex items-center">
              <Skeleton className="mr-2 h-4 w-4" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-8 lg:col-span-2">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-20" />
            ))}
          </div>

          {/* Description Card */}
          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-500/5 dark:bg-black/70">
            <div className="p-8">
              <Skeleton className="mb-6 h-8 w-1/3" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>

          {/* Stats Card */}
          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-500/5 dark:bg-black/70">
            <div className="p-8">
              <Skeleton className="mb-6 h-8 w-1/3" />
              <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-5">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex flex-col items-center">
                    <Skeleton className="mb-2 h-10 w-10 rounded-full" />
                    <Skeleton className="h-6 w-12" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Activity Card */}
          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-500/5 dark:bg-black/70">
            <div className="p-8">
              <Skeleton className="mb-6 h-8 w-1/3" />
              <div className="mb-8 flex w-full overflow-hidden rounded-full border border-gray-100 bg-white p-1 dark:border-gray-500/5 dark:bg-black/70">
                <Skeleton className="h-10 w-1/2" />
                <Skeleton className="h-10 w-1/2" />
              </div>
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-6 dark:border-gray-500/5 dark:bg-black/70"
                  >
                    <div className="flex items-start gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1">
                        <div className="mb-2 flex items-center justify-between">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                        <Skeleton className="h-16 w-full" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Action Buttons Card */}
          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-500/5 dark:bg-black/70">
            <div className="space-y-3 p-4">
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-11 w-full" />
              <Skeleton className="h-11 w-full" />
            </div>
          </div>

          {/* Creator Profile Card */}
          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-500/5 dark:bg-black/70">
            <div className="px-6 py-6">
              <Skeleton className="mx-auto mb-4 h-6 w-1/3" />
              <div className="flex flex-col items-center text-center">
                <Skeleton className="mb-4 h-24 w-24 rounded-full" />
                <Skeleton className="mb-2 h-6 w-32" />
                <Skeleton className="mb-2 h-4 w-40" />
                <Skeleton className="mb-2 h-12 w-full" />
                <Skeleton className="mb-2 h-px w-full" />
                <Skeleton className="h-6 w-40" />
              </div>
            </div>
          </div>

          {/* Similar Projects Card */}
          <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-500/5 dark:bg-black/70">
            <div className="px-3 py-6">
              <Skeleton className="mb-3 h-6 w-1/3" />
              <div className="flex flex-col space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white transition-all duration-300 hover:shadow-lg dark:border-gray-500/5 dark:bg-black/70"
                  >
                    <div className="my-2 flex gap-2 px-1">
                      <Skeleton className="size-12 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="mb-1 h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailSkeleton;
