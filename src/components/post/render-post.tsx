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
  ChevronDown,
  ChevronRight,
  Dot,
  MessageCircleIcon,
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
import PostCommentInterface from "@/interface/auth/comment.interface";

const RenderPost = () => {
  const { ref, inView } = useInView();
  const session = authClient.useSession();
  const [editModal, setEditModal] = useState(false);
  const { selectedPost, setSelectedPost, content, setContent } = usePostStore();
  const [editPostInput, setEditPostInput] = useState<String>();
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [commentShown, setCommentShown] = useState<boolean>(false);
  const [expandedComments, setExpandedComments] = useState<{
    [key: string]: boolean;
  }>({});
  const [replyShown, setReplyShown] = useState<{ [key: string]: boolean }>({});
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>(
    {},
  );
  const [commentContent, setCommentContent] = useState<string>("");

  const toggleCommentExpand = (commentId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const toggleReplyShown = (commentId: string) => {
    setReplyShown((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const [expandedReplies, setExpandedReplies] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleReplies = (commentId: string) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
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
    queryKey: ["posts"],
    queryFn: fetchPosts,
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const { data: comment, isLoading: commentLoading } = useQuery({
    queryKey: ["comment"],
    queryFn: async () => {
      const response = await axios.get(
        `/api/post/comment?postId=${selectedPost.id}`,
      );

      console.log(`/api/post/comment?postId=${selectedPost.id}`);

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

  const replyMutation = useMutation({
    mutationKey: ["reply-comment"],
    mutationFn: async ({
      commentId,
      content,
    }: {
      commentId: string;
      content: string;
    }) => {
      const response = await axios.post("/api/post/comment", {
        postId: selectedPost.id,
        content,
        parentId: commentId,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comment"] });
    },
    onError: () => {
      toast.error("Error occurred while replying to comment");
    },
  });

  const commentMutation = useMutation({
    mutationKey: ["add-comment"],
    mutationFn: async ({
      postId,
      content,
    }: {
      postId: string;
      content: string;
    }) => {
      const response = await axios.post("/api/post/comment", {
        postId,
        content,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comment"] });
      setCommentContent("");
    },
    onError: () => {
      toast.error("Error occurred while adding comment");
    },
  });

  const handleReplySubmit = (commentId: string) => {
    if (replyContent[commentId]) {
      replyMutation.mutate({ commentId, content: replyContent[commentId] });
      setReplyContent((prev) => ({ ...prev, [commentId]: "" }));
    }
  };

  const handleCommentSubmit = () => {
    if (commentContent) {
      commentMutation.mutate({
        postId: selectedPost.id,
        content: commentContent,
      });
    }
  };

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

  const renderComments = (
    comments: PostCommentInterface[],
    parentId: String | null,
    level = 0,
  ) => {
    return (
      comments &&
      comments
        .filter(
          (comment: PostCommentInterface) => comment?.parentId === parentId,
        )
        .map((comment) => {
          const contentWords = comment.content.split(" ");
          const trimLimit = 20; // Adjust the trim limit as needed
          const truncatedContent = contentWords.slice(0, trimLimit).join(" ");
          const isLongContent = contentWords.length > trimLimit;

          return (
            <div
              key={comment.id}
              className={`relative my-1 py-2 ml-${level * 4} pl-4`}
            >
              <div className="absolute left-0 top-0 ml-4 h-full w-6 rounded-l border-b border-l border-t-0 border-white/5"></div>
              <div className="flex items-center justify-between pl-2">
                <div className="flex gap-2">
                  <Image
                    className="size-8 rounded-full"
                    src={comment.user?.image || "/user.jpg"}
                    height={200}
                    width={200}
                    alt="user"
                  />
                  <div className="flex items-center">
                    <h4 className="text-xs">{comment?.user?.visualName}</h4>
                    <Dot />
                    <p className="text-xs">{timeAgo(comment.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className="rounded-xl border p-2"
                    onClick={() => {
                      toggleReplyShown(comment.id);
                    }}
                  >
                    <MessageCircleIcon size={16} className="" />
                  </button>
                  <button
                    className="rounded-xl border p-2"
                    onClick={() => toggleReplies(comment.id)}
                  >
                    {expandedReplies[comment.id] ? (
                      <ChevronDown size={16} />
                    ) : (
                      <ChevronRight size={16} />
                    )}
                  </button>
                </div>
              </div>

              <div className="mt-2 w-[90%] pl-4">
                <p className="text-xs">
                  {expandedComments[comment.id] || !isLongContent
                    ? comment.content
                    : `${truncatedContent}...`}
                </p>
                {isLongContent && (
                  <button
                    className="mt-2 text-xs underline"
                    onClick={() => toggleCommentExpand(comment.id)}
                  >
                    {expandedComments[comment.id] ? "See less" : "See more"}
                  </button>
                )}
                {expandedComments[comment.id] &&
                  renderComments(comments, comment?.id, level + 1)}
              </div>

              {replyShown[comment.id] && (
                <div className="mt-2 flex items-start gap-2 pl-8">
                  <input
                    placeholder="Reply here"
                    className="w-full border-0 border-b border-white/5 bg-transparent p-1 text-sm placeholder:font-instrument placeholder:text-lg focus:border-b focus:border-gray-500 focus:outline-none focus:ring-0"
                    value={replyContent[comment.id] || ""}
                    onChange={(e) =>
                      setReplyContent((prev) => ({
                        ...prev,
                        [comment.id]: e.target.value,
                      }))
                    }
                  />
                  <Button
                    className="mt-2 rounded-lg border bg-transparent px-2 py-1 hover:bg-transparent focus:outline-none focus:ring-0"
                    onClick={() => handleReplySubmit(comment.id)}
                  >
                    <SendIcon color="white" size={8} />
                  </Button>
                </div>
              )}

              {expandedReplies[comment.id] &&
                renderComments(comments, comment.id, level + 1)}
            </div>
          );
        })
    );
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
                    onClick={async () => {
                      await setSelectedPost(each);
                      setCommentShown(!commentShown);
                      await queryClient.invalidateQueries({
                        queryKey: ["comment"],
                      });
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
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                    />
                    <Button
                      onClick={handleCommentSubmit}
                      className="border bg-transparent hover:bg-transparent focus:outline-none focus:ring-0"
                    >
                      <SendIcon color="white" />
                    </Button>
                  </div>
                  {commentLoading && (
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
                          {/* <div></div> */}
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
                  )}
                  <div className="mt-4">{renderComments(comment, null)}</div>
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
