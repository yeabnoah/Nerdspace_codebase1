import React from "react";
import { Skeleton } from "../ui/skeleton";

const CommentSkeleton = () => {
  return (
    <div>
      <Skeleton className="my-2 ml-4 h-fit border bg-black/5 pb-3 pl-4">
        <div className="flex items-center gap-3">
          <Skeleton className="mt-2 size-10 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex flex-1 items-center gap-2">
              <Skeleton className="h-3 w-3/4 rounded" />
            </div>
            <div className="flex flex-1 items-center gap-2">
              <Skeleton className="h-3 w-1/3 rounded" />
            </div>
          </div>
        </div>
        <Skeleton className="my-2 h-4 w-[95%] rounded" />
      </Skeleton>
      <Skeleton className="my-2 ml-4 h-fit border bg-black/5 pb-3 pl-4">
        <div className="flex items-center gap-3">
          <Skeleton className="mt-2 size-10 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <div className="flex flex-1 items-center gap-2">
              <Skeleton className="h-3 w-3/4 rounded" />
            </div>
            <div className="flex flex-1 items-center gap-2">
              <Skeleton className="h-3 w-1/3 rounded" />
            </div>
          </div>
          {/* <div></div> */}
        </div>
        <Skeleton className="my-2 h-4 w-[95%] rounded" />
      </Skeleton>
    </div>
  );
};

export default CommentSkeleton;
