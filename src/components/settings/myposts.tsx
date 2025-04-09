"use client";

import changePostAccess from "@/functions/access-change-post";
import { timeAgo } from "@/functions/calculate-time-difference";
import fetchPosts from "@/functions/fetch-post";
import { getTrimLimit } from "@/functions/render-helper";
import postInterface from "@/interface/auth/post.interface";
import { authClient } from "@/lib/auth-client";
import usePostStore from "@/store/post.store";
import { PostAccess } from "@prisma/client";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import {
  BanIcon,
  BookmarkIcon,
  Edit,
  Heart,
  LockIcon,
  LockOpen,
  MessageCircle,
  MoreHorizontal,
  Share2Icon,
  TrashIcon,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { useInView } from "react-intersection-observer";
import DeleteModal from "../modal/delete.modal";
import EditModal from "../modal/edit.modal";
import RenderPostSkeleton from "../skeleton/render-post.skeleton";
import { Card } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Skeleton } from "../ui/skeleton";
import { queryClient } from "@/providers/tanstack-query-provider";
import toast from "react-hot-toast";
import fetchMyPosts from "@/functions/fetch-my-post";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { HiBookmark, HiOutlineBookmark } from "react-icons/hi2";
import ImagePreviewDialog from "../image-preview";
import { useRouter } from "next/navigation";

const RenderMyPost = () => {
  const { ref, inView } = useInView();
  const session = authClient.useSession();
  const router = useRouter();
  const [editModal, setEditModal] = useState(false);
  const { selectedPost, setSelectedPost, content, setContent } = usePostStore();
  const [editPostInput, setEditPostInput] = useState<String>();
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState<{
    [key: string]: boolean;
  }>({});
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(
    null,
  );
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
    queryKey: ["my-posts"],
    queryFn: fetchMyPosts,
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const mutation = useMutation({
    mutationKey: ["posts"],
    mutationFn: changePostAccess,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
    },
    onError: () => {
      toast.error("error occured while updating post");
    },
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

  const changePostAccessType = async (currentPost: postInterface) => {
    setSelectedPost(currentPost);
    await mutation.mutate();
  };

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

          inView && hasNextPage && fetchNextPage();

          return (
            <div
              className="relative my-5 w-full flex-1 border-b border-r border-transparent p-4 px-3 before:absolute before:bottom-0 before:right-0 before:h-[1px] before:w-full before:bg-gradient-to-r before:from-transparent before:via-orange-500/50 before:to-transparent after:absolute after:bottom-0 after:right-0 after:h-full after:w-[1px] after:bg-gradient-to-b after:from-transparent after:via-blue-500/50 after:to-transparent [&>div]:before:absolute [&>div]:before:left-0 [&>div]:before:top-0 [&>div]:before:h-full [&>div]:before:w-[1px] [&>div]:before:bg-gradient-to-b [&>div]:before:from-transparent [&>div]:before:via-blue-500/50 [&>div]:before:to-transparent"
              key={index}
              onClick={() => router.push(`/post/${each.id}`)}
            >
              {/* Orange diagonal glow from bottom-left to top-right */}
              <div className="absolute -bottom-5 left-12 size-32 rotate-45 rounded-full border border-orange-300/50 bg-gradient-to-tl from-orange-300/40 via-orange-400/30 to-transparent blur-[150px] backdrop-blur-sm"></div>

              {/* Blue diagonal glow from bottom-right to top-left */}
              <div className="absolute -right-4 size-32 -rotate-45 rounded-full border border-blue-300/50 bg-gradient-to-br from-blue-300/40 via-blue-400/50 to-transparent blur-[150px] backdrop-blur-sm"></div>

              <div className="relative pl-5 backdrop-blur-sm">
                <div className="mr-2 flex w-full items-center justify-between pb-2">
                  <div className="flex flex-1 items-center gap-3">
                    <Image
                      src={each.user.image || "/user.jpg"}
                      alt="user"
                      className="size-10 cursor-pointer rounded-full shadow-[0_0_3px_rgba(0,122,255,0.5),0_0_5px_rgba(255,165,0,0.5),0_0_7px_rgba(0,122,255,0.4)] transition-all"
                      height={200}
                      width={200}
                    />

                    <div className="cursor-pointer">
                      <h1 className="text-sm font-medium">{each.user.name}</h1>
                      <h1 className="text-xs text-muted-foreground text-purple-500">
                        Nerd@
                        <span className="text-white">{each.user.nerdAt}</span>
                      </h1>
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger className="py-0 outline-none">
                      <MoreHorizontal />
                    </DropdownMenuTrigger>
                    {session?.data?.user?.id === each.user.id ? (
                      <DropdownMenuContent className="mr-5 flex flex-row bg-white dark:bg-textAlternative md:mr-0 md:block">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedPost(each);
                            setContent(each.content);
                            setEditModal(true);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          <span className="hidden md:block">Edit</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedPost(each);
                            setContent(each.content);
                            setDeleteModal(true);
                          }}
                        >
                          <TrashIcon className="mr-2 h-4 w-4" />
                          <span className="hidden md:block">Delete</span>
                        </DropdownMenuItem>
                        {(each?.access as unknown as string) ===
                        (PostAccess.public as unknown as string) ? (
                          <DropdownMenuItem
                            onClick={() => {
                              changePostAccessType(each);
                            }}
                          >
                            <LockIcon className="mr-2 h-4 w-4" />
                            <span className="hidden md:block">Go Private</span>
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => {
                              changePostAccessType(each);
                            }}
                          >
                            <LockOpen className="mr-2 h-4 w-4" />
                            <span className="hidden md:block">Go Public</span>
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem>
                          <Share2Icon className="mr-2 h-4 w-4" />
                          <span className="hidden md:block">Share</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    ) : (
                      <DropdownMenuContent className="mr-5 flex flex-row justify-center bg-white dark:bg-textAlternative md:mr-0 md:block">
                        <DropdownMenuItem>
                          <Share2Icon className="mr-2 h-4 w-4" />
                          <span className="hidden md:block">Share</span>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <BanIcon className="mr-2 h-4 w-4" />
                          <span className="hidden md:block">Report</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    )}
                  </DropdownMenu>
                </div>

                <div
                  className={`mt-2 flex w-full flex-1 ${
                    isShortContent && isTooShort ? "flex-col" : "flex-row"
                  } items-start justify-center`}
                >
                  <div className="flex w-[100%] flex-1 flex-col justify-start gap-5">
                    {each.media && each.media.length > 0 && (
                      <div
                        className={`mt-4 grid w-[100%] flex-1 gap-2 ${getGridClass(
                          each.media.length,
                        )}`}
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
                              className="w-full rounded-xl object-cover"
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
                          <div className="grid h-[36vh] w-[82vw] grid-cols-[auto_120px] gap-2 md:w-[36vw]">
                            <div
                              className="relative h-full w-full"
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

                            <div className="flex w-full flex-col gap-2">
                              {each.media
                                .slice(1, 4)
                                .map(
                                  (
                                    media: { id: string; url: string },
                                    mediaIndex: number,
                                  ) => (
                                    <div
                                      key={media.id}
                                      className="relative h-full w-full"
                                      onClick={() =>
                                        handleMediaClick(
                                          mediaIndex + 1,
                                          each.media.map(
                                            (media: { url: string }) =>
                                              media.url,
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

                    <div className="flex-1 break-words">
                      <h4 className="break-all text-sm md:text-base">
                        {expandedStates[index] || !isLongContent
                          ? each.content
                          : `${truncatedContent}...`}
                      </h4>
                      {isLongContent && (
                        <button
                          className="mt-2 text-sm text-primary hover:underline"
                          onClick={() => toggleExpand(index)}
                        >
                          {expandedStates[index] ? "See less" : "See more"}
                        </button>
                      )}
                    </div>
                  </div>

                  <div
                    className={`flex ${
                      isShortContent && isTooShort
                        ? "mt-5 flex-row"
                        : "mt-5 flex-col"
                    } gap-5 md:w-16`}
                  >
                    <div
                      className={`rounded-full ${
                        isShortContent && isTooShort ? "pr-2" : "px-2"
                      } md:mx-auto`}
                    >
                      {each.likes?.some(
                        (like: { userId: string }) =>
                          like.userId === session.data?.user.id,
                      ) ? (
                        <GoHeartFill className="size-5 text-red-500" />
                      ) : (
                        <GoHeart className="size-5" />
                      )}
                    </div>
                    <div
                      className={`mx-auto cursor-pointer rounded-full ${
                        isShortContent && isTooShort ? "pr-2" : "px-2"
                      }`}
                    >
                      <MessageCircle className="size-5" />
                    </div>
                    <div
                      className={`mx-auto rounded-full ${
                        isShortContent && isTooShort ? "pr-2" : "px-2"
                      }`}
                    >
                      {each.bookmarks?.some(
                        (bookmark: { userId: string }) =>
                          bookmark.userId === session.data?.user.id,
                      ) ? (
                        <HiBookmark className="size-5 text-primary" />
                      ) : (
                        <HiOutlineBookmark className="size-5" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      <div ref={ref}>
        {isFetchingNextPage && (
          <div className="">
            o
            <Card className="my-5 rounded-xl border bg-transparent p-4 shadow-none dark:border-gray-500/5">
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
        )}
      </div>

      <ImagePreviewDialog
        images={selectedPostImages}
        initialIndex={selectedMediaIndex || 0}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />

      <EditModal
        selectedPost={selectedPost}
        setEditModal={setEditModal}
        editModal={editModal}
        content={content}
        setContent={setContent}
      />

      <DeleteModal
        selectedPost={selectedPost}
        setDeleteModal={setDeleteModal}
        deleteModal={deleteModal}
        content={content}
        setContent={setContent}
      />
    </div>
  );
};

export default RenderMyPost;
