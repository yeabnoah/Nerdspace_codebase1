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
import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import {
  BanIcon,
  BookmarkIcon,
  Edit,
  Heart,
  LockIcon,
  LockOpen,
  MessageCircle,
  MoreHorizontal,
  SendIcon,
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
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";

const RenderPost = () => {
  const { ref, inView } = useInView();
  const session = authClient.useSession();
  const [editModal, setEditModal] = useState(false);
  const { selectedPost, setSelectedPost, content, setContent } = usePostStore();
  const [editPostInput, setEditPostInput] = useState<String>();
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [commentShown, setCommentShown] = useState<boolean>(false);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const { data: comment } = useQuery({
    queryKey: ["comment"],
    queryFn: async () => {
      const response = await axios.get(
        `/api/post/comment?postId=2279139f-9bc3-464b-a9fc-e2bb9b84e088}`,
      );
      console.log("test", response.data.data);
      return response.data.data;
    },
  });

  const mutation = useMutation({
    mutationKey: ["change-post-status"],
    mutationFn: changePostAccess,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
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
    <div>
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
            <div className="my-5 rounded-xl border p-4" key={index}>
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
                  {session?.data?.user?.id === each.user.id ? (
                    <DropdownMenuContent className="mr-5 flex flex-row bg-white dark:bg-textAlternative md:mr-0 md:block">
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedPost(each);
                          setContent(each.content);
                          console.log(each);
                          setEditModal(true);
                        }}
                      >
                        <Edit />
                        <span className="hidden md:block">Edit</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedPost(each);
                          setContent(each.content);
                          console.log(each);
                          setDeleteModal(true);
                        }}
                      >
                        <TrashIcon />
                        <span className="hidden md:block">Delete</span>
                      </DropdownMenuItem>
                      {(each?.access as unknown as string) ===
                      (PostAccess.public as unknown as string) ? (
                        <DropdownMenuItem
                          onClick={() => {
                            changePostAccessType(each);
                          }}
                        >
                          <LockIcon />
                          <span className="hidden md:block">Go Private</span>
                        </DropdownMenuItem>
                      ) : (
                        <DropdownMenuItem
                          onClick={() => {
                            changePostAccessType(each);
                          }}
                        >
                          <LockOpen />
                          <span className="hidden md:block">Go Public</span>
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem>
                        <Share2Icon />
                        <span className="hidden md:block">share</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  ) : (
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
                  )}
                </DropdownMenu>
              </div>

              <div
                className={`mt-2 flex ${isShortContent && isTooShort ? "flex-col" : "flex-row"} items-start justify-center`}
              >
                <div className="flex-1">
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
                    onClick={() => {
                      setCommentShown(!commentShown);
                    }}
                    className={`cursor-pointer rounded-full ${isShortContent && isTooShort ? "pr-2" : "px-2"}`}
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

              {commentShown && (
                <div>
                  <hr className="mb-2 mt-5" />
                  <div className="itemc flex gap-2">
                    <input
                      placeholder="Comment here"
                      className="w-full border-0 border-b border-white/50 bg-transparent text-sm placeholder:font-instrument placeholder:text-lg focus:border-b focus:border-gray-500 focus:outline-none focus:ring-0"
                    />
                    <Button className="border bg-transparent focus:outline-none focus:ring-0">
                      <SendIcon color="white" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      <div ref={ref}>
        {isFetchingNextPage && (
          <div className="">
            <Card className="my-5 rounded-xl border bg-transparent p-4 shadow-none">
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

export default RenderPost;
