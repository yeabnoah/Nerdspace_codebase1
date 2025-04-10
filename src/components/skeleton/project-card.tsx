import { Skeleton } from "../ui/skeleton";

export function ProjectCardSkeleton() {
  return (
    <div className="group relative h-[380px] w-full max-w-sm overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-100 via-white to-zinc-50 shadow-md transition-all duration-300 hover:scale-[1.02] dark:from-zinc-900 dark:via-zinc-800/10 dark:to-black border-none">
      {/* Subtle animated glow effect */}
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-violet-500/5 via-transparent to-emerald-500/5 opacity-0 blur-xl transition-opacity duration-700 group-hover:opacity-100 dark:from-violet-500/10 dark:to-emerald-500/10"></div>

      {/* Background image skeleton */}
      <div className="absolute inset-0 z-0">
        <Skeleton className="h-full w-full opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-white/40 dark:from-black dark:via-black/80 dark:to-transparent"></div>
      </div>

      {/* Content container */}
      <div className="relative z-10 flex h-full flex-col p-6">
        {/* Top section with date badge and share button */}
        <div className="mb-auto flex w-full items-start justify-between">
          {/* Date badge skeleton */}
          <div className="overflow-hidden rounded-xl bg-zinc-800/10 backdrop-blur-md dark:bg-white/10">
            <div className="bg-zinc-800 px-3 py-1 text-center text-[10px] font-semibold text-white dark:bg-black/60">
              <Skeleton className="h-4 w-12 opacity-40" />
            </div>
            <div className="px-3 py-1.5 text-center">
              <Skeleton className="h-6 w-6 opacity-40" />
            </div>
          </div>

          {/* Share button skeleton */}
          <Skeleton className="h-8 w-8 rounded-full opacity-40" />
        </div>

        {/* Project details */}
        <div className="mt-auto space-y-4">
          {/* Status badge skeleton */}
          <Skeleton className="h-6 w-16 opacity-40" />

          {/* Title skeleton */}
          <Skeleton className="h-8 w-3/4 opacity-40" />

          {/* Timestamp skeleton */}
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-3 w-3 opacity-40" />
            <Skeleton className="h-3 w-24 opacity-40" />
          </div>

          {/* Description skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full opacity-40" />
            <Skeleton className="h-4 w-2/3 opacity-40" />
          </div>

          {/* Action button skeleton */}
          <Skeleton className="mt-4 h-10 w-full opacity-40" />
        </div>
      </div>

      {/* Subtle border glow */}
      <div className="absolute inset-0 rounded-2xl border border-zinc-200 transition-all duration-300 group-hover:border-zinc-300 dark:border-white/5 dark:group-hover:border-white/10"></div>
    </div>
  );
}
