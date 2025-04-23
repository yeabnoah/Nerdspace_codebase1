import React from "react";

const UserListSkeleton = () => {
  // Create an array of 6 items to render skeleton cards
  const skeletonItems = Array.from({ length: 6 }, (_, i) => i);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {skeletonItems.map((item) => (
        <div 
          key={item} 
          className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-gray-500/10 dark:bg-black/80 animate-pulse"
          style={{ animationDelay: `${item * 100}ms` }}
        >
          <div className="flex flex-col items-center text-center">
            <div className="relative mb-3 h-20 w-20">
              <div className="h-full w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700"></div>
            </div>
            
            <div className="mb-1 h-6 w-32 rounded-md bg-zinc-200 dark:bg-zinc-700"></div>
            <div className="mb-3 h-4 w-24 rounded-md bg-zinc-200 dark:bg-zinc-700"></div>
            
            <div className="mb-4 flex items-center gap-4">
              <div className="h-4 w-16 rounded-md bg-zinc-200 dark:bg-zinc-700"></div>
              <div className="h-4 w-16 rounded-md bg-zinc-200 dark:bg-zinc-700"></div>
            </div>
            
            <div className="h-10 w-full rounded-full bg-zinc-200 dark:bg-zinc-700"></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserListSkeleton;
