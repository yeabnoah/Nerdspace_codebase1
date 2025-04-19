"use client";

import fetchMyPosts from "@/functions/fetch-my-post";
import { getTrimLimit } from "@/functions/render-helper";
import { useInfiniteQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useInView } from "react-intersection-observer";
import ImagePreviewDialog from "../image-preview";
import RenderPostSkeleton from "../skeleton/render-post.skeleton";

const RenderMyPost = () => {
  const { ref, inView } = useInView();
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null);
  const [selectedPostImages, setSelectedPostImages] = useState<string[]>([]);
  const [expandedStates, setExpandedStates] = useState<Record<string, boolean>>({});

  const toggleExpand = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedStates((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["my-posts"],
    queryFn: fetchMyPosts,
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const getGridClass = (mediaCount: number) => {
    switch (mediaCount) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-2";
      case 3:
      case 4:
        return "grid-cols-[auto_100px]";
      default:
        return "";
    }
  };

  if (isLoading) {
    return <RenderPostSkeleton />;
  }

  if (data && data.pages.flatMap((page) => page.data).length === 0) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-500/5 dark:bg-card/50">
        <div className="text-center">
          <h3 className="mb-2 text-lg font-medium">No posts yet</h3>
          <p className="text-sm text-muted-foreground">
            Posts you create will appear here
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center rounded-xl border border-gray-100 bg-white p-6 shadow-sm dark:border-gray-500/5 dark:bg-card/50">
        <div className="text-center">
          <h3 className="mb-2 text-lg font-medium">Something went wrong</h3>
          <p className="text-sm text-muted-foreground">
            Failed to load posts. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="md:w-[80%]">
      {data?.pages
        .flatMap((page) => page.data)
        .map((each, index) => {
          const contentWords = each.content.split(" ");
          const trimLimit = getTrimLimit();
          const truncatedContent = contentWords.slice(0, trimLimit).join(" ");
          const isLongContent = contentWords.length > trimLimit;
          const isExpanded = expandedStates[each.id] || false;

          if (inView && hasNextPage) {
            fetchNextPage();
          }

          return (
            <div
              key={index}
              className="relative my-5 w-full flex-1 border-b border-r border-transparent p-2 px-2 before:absolute before:bottom-0 before:right-0 before:h-[1px] before:w-full before:bg-gradient-to-r before:from-transparent before:via-orange-500/10 before:to-transparent after:absolute after:bottom-0 after:right-0 after:h-full after:w-[1px] after:bg-gradient-to-b after:from-transparent after:via-blue-500/20 after:to-transparent sm:p-4 sm:px-3 [&>div]:before:absolute [&>div]:before:left-0 [&>div]:before:top-0 [&>div]:before:h-full [&>div]:before:w-[1px] [&>div]:before:bg-gradient-to-b [&>div]:before:from-transparent [&>div]:before:via-blue-500/20 [&>div]:before:to-transparent cursor-pointer transition-all duration-200 hover:bg-black/5"
              onClick={() => router.push(`/post/${each.id}`)}
            >
              {/* Orange diagonal glow from bottom-left to top-right */}
              <div className="absolute hidden md:block -right-4 size-32 -rotate-45 rounded-full border border-blue-300/50 bg-gradient-to-br from-blue-300/40 via-blue-400/50 to-transparent blur-[150px] backdrop-blur-sm"></div>

              <div className="absolute hidden md:block -bottom-5 left-12 size-32 rotate-45 rounded-full border border-orange-300/50 bg-gradient-to-tl from-orange-300/40 via-orange-400/30 to-transparent blur-[150px] backdrop-blur-sm"></div>

              <div className="relative md:pl-3 backdrop-blur-sm sm:pl-5">
                <div className="mr-2 flex w-full flex-col items-start justify-between gap-2 pb-2 sm:flex-row sm:items-center sm:gap-0">
                  <div className="flex flex-1 items-center gap-2 sm:gap-3">
                    <Image
                      src={each.user.image || "/user.jpg"}
                      alt="user"
                      className="size-8 cursor-pointer rounded-full shadow-[0_0_3px_rgba(0,122,255,0.5),0_0_5px_rgba(255,165,0,0.5),0_0_7px_rgba(0,122,255,0.4)] transition-all sm:size-10"
                      height={200}
                      width={200}
                    />
                    <div>
                      <h1 className="text-xs font-medium sm:text-sm">{each.user.name}</h1>
                      <h1 className="text-[10px] text-muted-foreground sm:text-xs">
                        Nerd@<span className="text-purple-500">{each.user.nerdAt}</span>
                      </h1>
                    </div>
                  </div>
                </div>

                <div className="mt-2 flex w-full flex-1 flex-col items-start justify-center">
                  {each.media && each.media.length > 0 && (
                    <div className={`${!each.shared && "mt-2 sm:mt-4"} grid w-[100%] flex-1 gap-1 sm:gap-2 ${getGridClass(each.media.length)}`}>
                      {each.media.length === 1 && (
                        <div
                          className="relative h-[25vh] sm:h-[30vh] md:h-[36vh]"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedMediaIndex(0);
                            setSelectedPostImages(each.media.map((m: { url: string }) => m.url));
                            setIsDialogOpen(true);
                          }}
                        >
                          <Image
                            fill
                            src={each.media[0].url}
                            alt="Post media"
                            className="w-full rounded-xl object-cover transition-transform duration-300 hover:scale-[1.02]"
                          />
                        </div>
                      )}
                      {each.media.length === 2 &&
                        each.media.map((media: { url: string }, mediaIndex: number) => (
                          <div
                            key={mediaIndex}
                            className="relative h-[15vh] sm:h-[20vh] md:h-[28vh]"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMediaIndex(mediaIndex);
                              setSelectedPostImages(each.media.map((m: { url: string }) => m.url));
                              setIsDialogOpen(true);
                            }}
                          >
                            <Image
                              fill
                              src={media.url}
                              alt="Post media"
                              className="h-full w-full rounded-xl object-cover transition-transform duration-300 hover:scale-[1.02]"
                            />
                          </div>
                        ))}
                      {each.media.length >= 3 && (
                        <div className="grid h-[30vh] w-full max-w-[82vw] grid-cols-[auto_100px] gap-1 sm:h-[36vh] sm:grid-cols-[auto_120px] sm:gap-2 md:w-[36vw]">
                          <div
                            className="relative h-full w-full"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedMediaIndex(0);
                              setSelectedPostImages(each.media.map((m: { url: string }) => m.url));
                              setIsDialogOpen(true);
                            }}
                          >
                            <Image
                              fill
                              src={each.media[0].url}
                              alt="Post media"
                              className="h-full w-full rounded-xl object-cover transition-transform duration-300 hover:scale-[1.02]"
                            />
                          </div>

                          <div className="flex w-full flex-col gap-1 sm:gap-2">
                            {each.media.slice(1, 4).map((media: { url: string }, mediaIndex: number) => (
                              <div
                                key={mediaIndex}
                                className="relative h-full w-full"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedMediaIndex(mediaIndex + 1);
                                  setSelectedPostImages(each.media.map((m: { url: string }) => m.url));
                                  setIsDialogOpen(true);
                                }}
                              >
                                <Image
                                  fill
                                  src={media.url}
                                  alt="Post media"
                                  className="h-full w-full rounded-xl object-cover transition-transform duration-300 hover:scale-[1.02]"
                                />
                                {mediaIndex === 2 && each.media.length > 4 && (
                                  <div className="absolute bottom-1 right-1 rounded-full bg-black/50 px-1 py-0.5 text-[10px] text-white sm:bottom-2 sm:right-2 sm:px-2 sm:py-1 sm:text-xs">
                                    +{each.media.length - 4}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="mt-4 flex-1 break-words">
                    <h4 className="whitespace-pre-wrap break-all text-xs sm:text-sm md:text-sm">
                      {isExpanded || !isLongContent ? each.content : `${truncatedContent}...`}
                    </h4>
                    {isLongContent && (
                      <button
                        onClick={(e) => toggleExpand(each.id, e)}
                        className="mt-1 text-xs text-purple-500 hover:text-purple-600 hover:underline transition-colors sm:mt-2 sm:text-sm"
                      >
                        {isExpanded ? "See less" : "See more"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

      <div ref={ref}>
        {isFetchingNextPage && <RenderPostSkeleton />}
      </div>

      <ImagePreviewDialog
        images={selectedPostImages}
        initialIndex={selectedMediaIndex || 0}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  );
};

export default RenderMyPost;
