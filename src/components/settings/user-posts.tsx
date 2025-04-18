"use client";

import type React from "react";

import { timeAgo } from "@/functions/calculate-time-difference";
import { getTrimLimit } from "@/functions/render-helper";
import useUserProfileStore from "@/store/userProfile.store";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";
import {
  BanIcon,
  MessageCircle,
  MoreHorizontal,
  Share2Icon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import ImagePreviewDialog from "../image-preview";
import RenderPostSkeleton from "../skeleton/render-post.skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { HiBookmark, HiOutlineBookmark } from "react-icons/hi2";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  EmojiPicker,
  EmojiPickerSearch,
  EmojiPickerContent,
  EmojiPickerFooter,
} from "@/components/ui/emoji-picker";
import { SmileIcon, SendIcon } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { renderComments } from "../post/comment/render-comments";
import CommentSkeleton from "../skeleton/comment.skelton";

const iconVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.2 },
  tap: { scale: 0.9 },
};

const likeVariants = {
  initial: { scale: 1, color: "currentColor" },
  liked: { scale: [1, 1.2, 1], color: "#ef4444" },
};

const bookmarkVariants = {
  initial: { scale: 1, color: "currentColor" },
  bookmarked: { scale: [1, 1.2, 1], color: "var(--primary)" },
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

const RenderUserPosts = () => {
  const { ref, inView } = useInView();
  const router = useRouter();
  const queryClient = useQueryClient();
  const session = authClient.useSession();
  const { userProfile } = useUserProfileStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(
    null,
  );
  const [selectedPostImages, setSelectedPostImages] = useState<string[]>([]);
  const [expandedStates, setExpandedStates] = useState<Record<string, boolean>>(
    {},
  );
  const [commentContent, setCommentContent] = useState("");
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [commentShown, setCommentShown] = useState<{ [key: string]: boolean }>({});
  const [expandedComments, setExpandedComments] = useState<{ [key: string]: boolean }>({});
  const [replyShown, setReplyShown] = useState<{ [key: string]: boolean }>({});
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});
  const [expandedReplies, setExpandedReplies] = useState<{ [key: string]: boolean }>({});
  const [commentId, setCommentId] = useState<string>("");
  const [optimisticLikes, setOptimisticLikes] = useState<{ [key: string]: boolean }>({});
  const [optimisticBookmarks, setOptimisticBookmarks] = useState<{ [key: string]: boolean }>({});

  // Fetch user posts with infinite query
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["user-posts", userProfile?.id],
    queryFn: ({ pageParam = null }) => {
      return axios
        .get(
          `/api/user/posts?userId=${userProfile?.id}${pageParam ? `&cursor=${pageParam}` : ""}`,
        )
        .then((response) => response.data);
    },
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !!userProfile?.id,
  });

  const likeMutation = useMutation({
    mutationFn: async (postId: string) => {
      const response = await axios.post("/api/post/like", {
        postId,
        userId: session.data?.user.id,
      });
      return response.data.data;
    },
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["user-posts"] });
      const previousPosts = queryClient.getQueryData(["user-posts"]);

      setOptimisticLikes((prev) => ({
        ...prev,
        [postId]: !prev[postId],
      }));

      queryClient.setQueryData(["user-posts"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.map((p: any) => {
              if (p.id === postId) {
                const isLiked = p.likes?.some(
                  (like: any) => like.userId === session.data?.user.id,
                );
                return {
                  ...p,
                  likes: isLiked
                    ? p.likes.filter(
                        (like: any) => like.userId !== session.data?.user.id,
                      )
                    : [
                        ...p.likes,
                        { userId: session.data?.user.id, postId: p.id },
                      ],
                  _count: {
                    ...p._count,
                    likes: isLiked ? p._count.likes - 1 : p._count.likes + 1,
                  },
                };
              }
              return p;
            }),
          })),
        };
      });

      return { previousPosts };
    },
    onError: (err, postId, context) => {
      setOptimisticLikes((prev) => ({
        ...prev,
        [postId]: !optimisticLikes[postId],
      }));
      queryClient.setQueryData(["user-posts"], context?.previousPosts);
      toast.error("Error occurred while liking/unliking post");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-posts"] });
    },
  });

  const bookmarkMutation = useMutation({
    mutationFn: async (postId: string) => {
      const response = await axios.post("/api/post/bookmark", {
        postId,
        userId: session.data?.user.id,
      });
      return response.data.data;
    },
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["user-posts"] });
      const previousPosts = queryClient.getQueryData(["user-posts"]);

      setOptimisticBookmarks((prev) => ({
        ...prev,
        [postId]: !prev[postId],
      }));

      queryClient.setQueryData(["user-posts"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.map((p: any) => {
              if (p.id === postId) {
                const isBookmarked = p.bookmarks.some(
                  (bookmark: any) => bookmark.userId === session.data?.user.id,
                );
                return {
                  ...p,
                  bookmarks: isBookmarked
                    ? p.bookmarks.filter(
                        (bookmark: any) =>
                          bookmark.userId !== session.data?.user.id,
                      )
                    : [
                        ...p.bookmarks,
                        { userId: session.data?.user.id, postId: p.id },
                      ],
                  _count: {
                    ...p._count,
                    bookmarks: isBookmarked
                      ? p._count.bookmarks - 1
                      : p._count.bookmarks + 1,
                  },
                };
              }
              return p;
            }),
          })),
        };
      });

      return { previousPosts };
    },
    onError: (err, postId, context) => {
      setOptimisticBookmarks((prev) => ({
        ...prev,
        [postId]: !optimisticBookmarks[postId],
      }));
      queryClient.setQueryData(["user-posts"], context?.previousPosts);
      toast.error("Error occurred while bookmarking/unbookmarking post");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-posts"] });
    },
  });

  const commentMutation = useMutation({
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
    onMutate: async ({ postId, content }) => {
      await queryClient.cancelQueries({ queryKey: ["user-posts"] });
      const previousPosts = queryClient.getQueryData(["user-posts"]);

      queryClient.setQueryData(["user-posts"], (old: any) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: page.data.map((p: any) => {
              if (p.id === postId) {
                return {
                  ...p,
                  _count: {
                    ...p._count,
                    replies: (p._count?.replies || 0) + 1,
                  },
                };
              }
              return p;
            }),
          })),
        };
      });

      return { previousPosts };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["user-posts"], context?.previousPosts);
      toast.error("Error occurred while adding comment");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-posts"] });
      queryClient.invalidateQueries({ queryKey: ["comment"] });
      setCommentContent("");
    },
  });

  const handleCommentSubmit = (postId: string) => {
    if (commentContent.trim()) {
      commentMutation.mutate({
        postId,
        content: commentContent.trim(),
      });
    }
  };

  const toggleCommentShown = (postId: string) => {
    setCommentShown((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

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

  const handleReplySubmit = (commentId: string) => {
    if (replyContent[commentId]?.trim()) {
      // Add your reply submission logic here
    }
  };

  const toggleReplies = (commentId: string) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleLike = (postId: string) => {
    if (!session.data?.user?.id) {
      toast.error("Please sign in to like posts");
      return;
    }
    likeMutation.mutate(postId);
  };

  const handleBookmark = (postId: string) => {
    if (!session.data?.user?.id) {
      toast.error("Please sign in to bookmark posts");
      return;
    }
    bookmarkMutation.mutate(postId);
  };

  const onEmojiClick = (emojiObject: any) => {
    const text = commentContent;
    const before = text.slice(0, cursorPosition);
    const after = text.slice(cursorPosition);
    const newText = before + emojiObject.emoji + after;
    setCommentContent(newText);
    setCursorPosition(cursorPosition + emojiObject.emoji.length);
  };

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}m`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  // Handle media preview
  const handleMediaClick = (
    postId: string,
    index: number,
    images: string[],
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    setSelectedMediaIndex(index);
    setSelectedPostImages(images);
    setIsDialogOpen(true);
  };

  // Toggle expanded content
  const toggleExpand = (postId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedStates((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  // Load more posts when scrolling to the bottom
  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, isFetchingNextPage]);

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
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
        </div>
      </div>
    );
  }

  const posts = data?.pages.flatMap((page) => page.data) || [];

  return (
    <div className="md:w-[80%]">
      {posts.map((post, index) => {
        const contentWords = post.content.split(" ");
        const trimLimit = getTrimLimit();
        const truncatedContent = contentWords.slice(0, trimLimit).join(" ");
        const isLongContent = contentWords.length > trimLimit;
        const isShortContent = contentWords.length < trimLimit;
        const isTooShort = contentWords.length < 10;
        const isExpanded = expandedStates[post.id] || false;
        const isLiked = post.likes?.some(
          (like: { userId: string }) => like.userId === session.data?.user.id,
        );
        const isBookmarked = post.bookmarks?.some(
          (bookmark: { userId: string }) =>
            bookmark.userId === session.data?.user.id,
        );

        return (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="relative my-5 w-full flex-1 border-b border-r border-transparent p-4 px-3 before:absolute before:bottom-0 before:right-0 before:h-[1px] before:w-full before:bg-gradient-to-r before:from-transparent before:via-orange-500/50 before:to-transparent after:absolute after:bottom-0 after:right-0 after:h-full after:w-[1px] after:bg-gradient-to-b after:from-transparent after:via-blue-500/50 after:to-transparent [&>div]:before:absolute [&>div]:before:left-0 [&>div]:before:top-0 [&>div]:before:h-full [&>div]:before:w-[1px] [&>div]:before:bg-gradient-to-b [&>div]:before:from-transparent [&>div]:before:via-blue-500/50 [&>div]:before:to-transparent"
            onClick={() => router.push(`/post/${post.id}`)}
          >
            {/* Orange diagonal glow from bottom-left to top-right */}
            <div className="absolute hidden md:block -bottom-5 left-12 size-32 rotate-45 rounded-full border border-orange-300/50 bg-gradient-to-tl from-orange-300/40 via-orange-400/30 to-transparent blur-[150px] backdrop-blur-sm"></div>

            {/* Blue diagonal glow from bottom-right to top-left */}
            <div className="absolute hidden md:block -right-4 size-32 -rotate-45 rounded-full border border-blue-300/50 bg-gradient-to-br from-blue-300/40 via-blue-400/50 to-transparent blur-[150px] backdrop-blur-sm"></div>

            <div className="relative pl-5 backdrop-blur-sm">
              {/* Post Header */}
              <div className="mr-2 flex w-full items-center justify-between pb-2">
                <div className="flex flex-1 items-center gap-3">
                  <Image
                    src={post.user.image || "/user.jpg"}
                    alt={post.user.name}
                    className="size-10 cursor-pointer rounded-full shadow-[0_0_3px_rgba(0,122,255,0.5),0_0_5px_rgba(255,165,0,0.5),0_0_7px_rgba(0,122,255,0.4)] transition-all"
                    height={200}
                    width={200}
                  />
                  <div className="cursor-pointer">
                    <h1 className="text-sm font-medium">{post.user.name}</h1>
                    <h1 className="text-xs text-muted-foreground text-purple-500">
                      Nerd@
                      <span className="text-white">{post.user.nerdAt}</span>
                    </h1>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger className="py-0 outline-none">
                    <MoreHorizontal />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="mr-5 flex flex-row bg-white dark:bg-textAlternative md:mr-0 md:block">
                    <DropdownMenuItem>
                      <Share2Icon className="mr-2 h-4 w-4" />
                      <span className="hidden md:block">Share</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <BanIcon className="mr-2 h-4 w-4" />
                      <span className="hidden md:block">Report</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div
                className={`mt-2 flex w-full flex-1 ${
                  isShortContent && isTooShort ? "flex-col" : "flex-row"
                } items-start justify-center`}
              >
                <div className="flex w-[100%] flex-1 flex-col justify-start gap-5">
                  {post.media && post.media.length > 0 && (
                    <div className={`mt-4 grid w-[100%] flex-1 gap-2 ${getGridClass(post.media.length)}`}>
                      {post.media.length === 1 && (
                        <div
                          className="relative h-[30vh] md:h-[36vh]"
                          onClick={(e) => handleMediaClick(post.id, 0, post.media.map((m: { url: string }) => m.url), e)}
                        >
                          <Image
                            fill
                            src={post.media[0].url}
                            alt="Post media"
                            className="w-full rounded-xl object-cover"
                          />
                        </div>
                      )}
                      {post.media.length === 2 &&
                        post.media.map((m: { id: string; url: string }, index: number) => (
                          <div
                            key={m.id}
                            className="relative h-[20vh] md:h-[28vh]"
                            onClick={(e) => handleMediaClick(post.id, index, post.media.map((m: { url: string }) => m.url), e)}
                          >
                            <Image
                              fill
                              src={m.url}
                              alt="Post media"
                              className="h-full w-full rounded-xl object-cover"
                            />
                          </div>
                        ))}
                      {post.media.length >= 3 && (
                        <div className="grid h-[36vh] w-[82vw] grid-cols-[auto_120px] gap-2 md:w-[36vw]">
                          <div
                            className="relative h-full w-full"
                            onClick={(e) => handleMediaClick(post.id, 0, post.media.map((m: { url: string }) => m.url), e)}
                          >
                            <Image
                              fill
                              src={post.media[0].url}
                              alt="Post media"
                              className="h-full w-full rounded-xl object-cover"
                            />
                          </div>
                          <div className="flex w-full flex-col gap-2">
                            {post.media.slice(1, 4).map((m: { id: string; url: string }, index: number) => (
                              <div
                                key={m.id}
                                className="relative h-full w-full"
                                onClick={(e) => handleMediaClick(post.id, index + 1, post.media.map((m: { url: string }) => m.url), e)}
                              >
                                <Image
                                  fill
                                  src={m.url}
                                  alt="Post media"
                                  className="h-full w-full rounded-xl object-cover"
                                />
                                {index === 2 && post.media.length > 4 && (
                                  <div className="absolute bottom-2 right-2 rounded-full bg-black/50 px-2 py-1 text-white">
                                    +{post.media.length - 4}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex-1 break-words">
                    <h4 className="whitespace-pre-wrap break-all text-xs sm:text-sm md:text-sm">
                      {(expandedStates[index] || !isLongContent
                        ? post.content
                        : truncatedContent
                      ).split(/(\s+)/).map((word: string, i: number) => (
                        word.startsWith('#') 
                          ? <span key={i} className="text-purple-500">{word}</span>
                          : word
                      ))}
                      {!expandedStates[index] && isLongContent && '...'}
                    </h4>
                    {isLongContent && (
                      <button
                        className="mt-1 text-xs text-purple-500 hover:underline sm:mt-2 sm:text-sm"
                        onClick={(e) => toggleExpand(post.id, e)}
                      >
                        {expandedStates[index] ? "See less" : "See more"}
                      </button>
                    )}
                  </div>
                </div>

                <div
                  className={`flex ${
                    isShortContent && isTooShort
                      ? "mt-3 flex-row sm:mt-5"
                      : "mt-3 flex-col sm:mt-5"
                  } gap-2 sm:gap-3 md:w-16`}
                >
                  <motion.div
                    className={`rounded-full ${
                      isShortContent && isTooShort ? "pr-0.5 sm:pr-1 flex items-center gap-1" : "px-0.5 sm:px-1"
                    } cursor-pointer md:mx-auto`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(post.id);
                    }}
                    variants={likeVariants}
                    initial="initial"
                    animate={
                      optimisticLikes[post.id] !== undefined
                        ? optimisticLikes[post.id]
                          ? "liked"
                          : "initial"
                        : post.likes?.some(
                              (like: { userId: string }) => like.userId === session.data?.user.id,
                            )
                          ? "liked"
                          : "initial"
                    }
                    whileHover="hover"
                    whileTap="tap"
                    transition={{ duration: 0.2 }}
                  >
                    <div className={`flex ${isShortContent && isTooShort ? "flex-row items-center gap-1" : "flex-col items-center gap-0.5"}`}>
                      {optimisticLikes[post.id] !== undefined ? (
                        optimisticLikes[post.id] ? (
                          <GoHeartFill className="size-4 text-red-500 sm:size-5" />
                        ) : (
                          <GoHeart className="size-4 sm:size-5" />
                        )
                      ) : post.likes?.some(
                          (like: { userId: string }) => like.userId === session.data?.user.id,
                        ) ? (
                        <GoHeartFill className="size-4 text-red-500 sm:size-5" />
                      ) : (
                        <GoHeart className="size-4 sm:size-5" />
                      )}
                      <span className="text-xs font-medium">{formatCount(post._count?.likes || 0)}</span>
                    </div>
                  </motion.div>

                  <motion.div
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCommentShown(post.id);
                    }}
                    className={`mx-auto cursor-pointer rounded-full ${
                      isShortContent && isTooShort ? "pr-0.5 sm:pr-1 flex items-center gap-1" : "px-0.5 sm:px-1"
                    }`}
                    variants={iconVariants}
                    whileHover="hover"
                    whileTap="tap"
                    transition={{ duration: 0.2 }}
                  >
                    <div className={`flex ${isShortContent && isTooShort ? "flex-row items-center gap-1" : "flex-col items-center gap-0.5"}`}>
                      <MessageCircle className="size-4 sm:size-5" />
                      <span className="text-xs font-medium">{formatCount(post._count?.replies || 0)}</span>
                    </div>
                  </motion.div>

                  <motion.div
                    className={`mx-auto rounded-full ${
                      isShortContent && isTooShort ? "pr-0.5 sm:pr-1 flex items-center gap-1" : "px-0.5 sm:px-1"
                    } cursor-pointer`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookmark(post.id);
                    }}
                    variants={bookmarkVariants}
                    initial="initial"
                    animate={
                      optimisticBookmarks[post.id] !== undefined
                        ? optimisticBookmarks[post.id]
                          ? "bookmarked"
                          : "initial"
                        : post.bookmarks.some(
                              (bookmark: { userId: string }) => bookmark.userId === session.data?.user.id,
                            )
                          ? "bookmarked"
                          : "initial"
                    }
                    whileHover="hover"
                    whileTap="tap"
                    transition={{ duration: 0.2 }}
                  >
                    <div className={`flex ${isShortContent && isTooShort ? "flex-row items-center gap-1" : "flex-col items-center gap-0.5"}`}>
                      {optimisticBookmarks[post.id] !== undefined ? (
                        optimisticBookmarks[post.id] ? (
                          <HiBookmark className="size-4 text-primary sm:size-5" />
                        ) : (
                          <HiOutlineBookmark className="size-4 sm:size-5" />
                        )
                      ) : post.bookmarks.some(
                          (bookmark: { userId: string }) => bookmark.userId === session.data?.user.id,
                        ) ? (
                        <HiBookmark className="size-4 text-primary sm:size-5" />
                      ) : (
                        <HiOutlineBookmark className="size-4 sm:size-5" />
                      )}
                      <span className="text-xs font-medium">{formatCount(post._count?.bookmarks || 0)}</span>
                    </div>
                  </motion.div>
                </div>
              </div>

              {commentShown[post.id] && (
                <div>
                  <hr className="mb-2 mt-3 sm:mt-5" />
                  <div className="itemc flex gap-2 py-2">
                    <div className="relative flex-1">
                      <input
                        placeholder="Comment here"
                        className="w-full border-0 border-b border-b-textAlternative/20 bg-transparent text-xs placeholder:font-instrument placeholder:text-base focus:border-b focus:border-gray-500 focus:outline-none focus:ring-0 py-2 px-2 dark:border-white/50 sm:text-sm sm:placeholder:text-lg"
                        value={commentContent}
                        onChange={(e) => setCommentContent(e?.target?.value)}
                        onSelect={(e) => setCursorPosition(e?.currentTarget?.selectionStart || 0)}
                      />
                      <div className="absolute bottom-1 right-2">
                        <Popover onOpenChange={setIsEmojiOpen} open={isEmojiOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-6 w-6 rounded-lg p-0 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                            >
                              <SmileIcon className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-fit p-0">
                            <EmojiPicker
                              className="h-[342px]"
                              onEmojiSelect={({ emoji }) => {
                                setIsEmojiOpen(false);
                                onEmojiClick({ emoji });
                              }}
                            >
                              <EmojiPickerSearch />
                              <EmojiPickerContent />
                              <EmojiPickerFooter />
                            </EmojiPicker>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleCommentSubmit(post.id)}
                      className="h-8 border bg-transparent shadow-none hover:bg-transparent focus:outline-none focus:ring-0 sm:h-9"
                    >
                      <SendIcon className="size-4 text-card-foreground dark:text-white sm:size-5" />
                    </Button>
                  </div>
                  {/* Add comment loading and rendering logic here */}
                </div>
              )}
            </div>
          </motion.div>
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

export default RenderUserPosts;
