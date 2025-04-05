import { Skeleton } from "../ui/skeleton";

const FollowListSkeleton = () => {
  return (
    <div className="my-5 hidden gap-2 rounded-xl border border-gray-100 px-4 py-5 shadow-none dark:border-gray-500/5 md:flex md:flex-col lg:w-[19vw]">
      <h1 className="font-instrument text-2xl italic">Who to Follow</h1>
      <div className="space-y-3">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="my-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex flex-col items-start">
                <Skeleton className="h-8 w-40" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FollowListSkeleton;


export const ProjectRecommendationSkeleton = () => {
  return (
    <div className="my-5 hidden gap-2 rounded-xl border border-gray-100 px-4 py-5 shadow-none dark:border-gray-500/5 md:flex md:flex-col lg:w-[19vw]">
      <h1 className="font-instrument text-2xl italic">Projects to Follow</h1>
      <div className="space-y-3">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="my-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex flex-col items-start">
                <Skeleton className="h-8 w-40" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

