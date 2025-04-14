"use client";

import { timeAgo } from "@/functions/calculate-time-difference";
import { getTrimLimit } from "@/functions/render-helper";
import useUserProfileStore from "@/store/userProfile.store";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  BanIcon,
  BookmarkIcon,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Share2Icon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useInView } from "react-intersection-observer";
import ImagePreviewDialog from "../image-preview";
import RenderPostSkeleton from "../skeleton/render-post.skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const fetchUserPosts = async ({ pageParam = null }: { pageParam: string | null }) => {
  const { userProfile } = useUserProfileStore.getState();
  const response = await axios.get(`/api/user/posts?userId=${userProfile?.id}${pageParam ? `&cursor=${pageParam}` : ''}`);
  return response.data;
};

const RenderUserPosts = () => {
  const { ref, inView } = useInView();
  const router = useRouter();
  const { userProfile } = useUserProfileStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null);
  const [selectedPostImages, setSelectedPostImages] = useState<string[]>([]);

  const handleMediaClick = (index: number, images: string[]) => {
    setSelectedMediaIndex(index);
    setSelectedPostImages(images);
    setIsDialogOpen(true);
  };

  const getGridClass = (mediaCount: number) => {
    switch (mediaCount) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-2";
      case 3:
      case 4:
        return "grid-cols-2";
      default:
        return "";
    }
  };

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["user-posts", userProfile?.id],
    queryFn: fetchUserPosts,
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!userProfile?.id,
  });

  const [expandedStates, setExpandedStates] = useState<boolean[]>(
    Array(data?.pages?.flatMap((page) => page.data)?.length).fill(false),
  );

  const toggleExpand = (index: number) => {
    setExpandedStates((prev) => {
      const newExpandedStates = [...prev];
      newExpandedStates[index] = !newExpandedStates[index];
      return newExpandedStates;
    });
  };

  if (isLoading) {
    return <RenderPostSkeleton />;
  }

  if (data && data.pages.flatMap((page) => page.data).length === 0) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        No posts available
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        Error loading posts
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
          const isShortContent = contentWords.length < trimLimit;
          const isTooShort = contentWords.length < 10;

          if (inView && hasNextPage) {
            fetchNextPage();
          }

          return (
            <div
              className="my-5 cursor-pointer rounded-xl border p-4 dark:border-gray-500/5"
              key={index}
              onClick={() => router.push(`/post/${each.id}`)}
            >
              <div className="mr-2 flex justify-between pb-2">
                <div className="flex items-center gap-5">
                  <Image
                    src={each.user.image || "/user.jpg"}
                    alt="user"
                    className="size-10 rounded-full"
                    height={200}
                    width={200}
                  />

                  <div>
                    <h1 className="text-sm">{each.user.name}</h1>
                    <h1 className="text-xs">{timeAgo(each.createdAt)}</h1>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger className="py-0 outline-none">
                    <MoreHorizontal />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="mr-5 flex flex-row justify-center bg-white dark:bg-textAlternative md:mr-0 md:block">
                    <DropdownMenuItem>
                      <Share2Icon />
                      <span className="hidden md:block">share</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <BanIcon />
                      <span className="hidden md:block">Report</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div
                className={`mt-2 flex ${isShortContent && isTooShort ? "flex-col" : "flex-row"} items-start justify-center`}
              >
                <div className="flex-1">
                  {each.media && each.media.length > 0 && (
                    <div
                      className={`mt-4 grid w-full flex-1 gap-2 ${getGridClass(each.media.length)}`}
                    >
                      {each.media.length === 1 && (
                        <div
                          className="relative h-[30vh] md:h-[36vh]"
                          onClick={() =>
                            handleMediaClick(
                              0,
                              each.media.map(
                                (media: { url: string }) => media.url,
                              ),
                            )
                          }
                        >
                          <Image
                            fill
                            src={each.media[0].url}
                            alt="Post media"
                            className="h-full w-full rounded-xl object-cover"
                          />
                        </div>
                      )}
                      {each.media.length === 2 &&
                        each.media.map(
                          (
                            media: { id: string; url: string },
                            mediaIndex: number,
                          ) => (
                            <div
                              key={media.id}
                              className="relative h-[20vh] md:h-[28vh]"
                              onClick={() =>
                                handleMediaClick(
                                  mediaIndex,
                                  each.media.map(
                                    (media: { url: string }) => media.url,
                                  ),
                                )
                              }
                            >
                              <Image
                                fill
                                src={media.url}
                                alt="Post media"
                                className="h-full w-full rounded-xl object-cover"
                              />
                            </div>
                          ),
                        )}
                      {each.media.length >= 3 && (
                        <div className="flex h-[24vh] w-[78vw] flex-1 gap-2 md:h-[32vh] md:w-[28.5vw]">
                          <div
                            className="relative col-span-2 flex-1"
                            onClick={() =>
                              handleMediaClick(
                                0,
                                each.media.map(
                                  (media: { url: string }) => media.url,
                                ),
                              )
                            }
                          >
                            <Image
                              fill
                              src={each.media[0].url}
                              alt="Post media"
                              className="h-full w-full rounded-xl object-cover"
                            />
                          </div>
                          <div className="flex h-full w-24 flex-col gap-2">
                            {each.media
                              .slice(1, 4)
                              .map(
                                (
                                  media: { id: string; url: string },
                                  mediaIndex: number,
                                ) => (
                                  <div
                                    key={media.id}
                                    className="relative h-28"
                                    onClick={() =>
                                      handleMediaClick(
                                        mediaIndex + 1,
                                        each.media.map(
                                          (media: { url: string }) => media.url,
                                        ),
                                      )
                                    }
                                  >
                                    <Image
                                      fill
                                      src={media.url}
                                      alt="Post media"
                                      className="h-full w-full rounded-xl object-cover"
                                    />
                                    {mediaIndex === 2 &&
                                      each.media.length > 4 && (
                                        <div className="absolute bottom-2 right-2 rounded-full bg-black/50 px-2 py-1 text-white">
                                          +{each.media.length - 4}
                                        </div>
                                      )}
                                  </div>
                                ),
                              )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  <h4 className="text-xs md:text-sm">
                    {expandedStates[index] || !isLongContent
                      ? each.content
                      : `${truncatedContent}...`}
                  </h4>
                  {isLongContent && (
                    <button
                      className="mt-2 text-xs underline"
                      onClick={() => toggleExpand(index)}
                    >
                      {expandedStates[index] ? "See less" : "See more"}
                    </button>
                  )}
                </div>

                <div
                  className={`flex ${isShortContent && isTooShort ? "mt-5 flex-row" : "flex-col"} gap-5`}
                >
                  <div
                    className={`rounded-full ${isShortContent && isTooShort ? "pr-2" : "px-2"}`}
                  >
                    <Heart className="size-5" />
                  </div>
                  <div
                    className={`rounded-full ${isShortContent && isTooShort ? "pr-2" : "px-2"}`}
                  >
                    <MessageCircle className="size-5" />
                  </div>
                  <div
                    className={`rounded-full ${isShortContent && isTooShort ? "pr-2" : "px-2"}`}
                  >
                    <BookmarkIcon className="size-5" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      <div ref={ref}>
        {isFetchingNextPage && (
          <div className="">
            <div className="my-5 rounded-xl border bg-transparent p-4 shadow-none dark:border-gray-500/5">
              <div className="flex items-center gap-5">
                <div className="size-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div>
                  <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700" />
                  <div className="mt-1 h-3 w-16 bg-gray-200 dark:bg-gray-700" />
                </div>
              </div>
              <div className="mt-4 h-16 w-full bg-gray-200 dark:bg-gray-700" />
              <div className="mt-4 flex gap-3">
                <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700" />
                <div className="h-6 w-6 rounded-full bg-gray-200 dark:bg-gray-700" />
              </div>
            </div>
          </div>
        )}
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

export default RenderUserPosts; 