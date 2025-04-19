"use client";

import type React from "react";
import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { PostAccess } from "@prisma/client";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { HiBookmark, HiOutlineBookmark } from "react-icons/hi2";
import {
  BanIcon,
  Clock,
  Edit,
  LockIcon,
  LockOpen,
  MessageCircle,
  MessageSquare,
  MoreHorizontal,
  Plus,
  SendIcon,
  SmileIcon,
  Star,
  TrashIcon,
} from "lucide-react";

import { getTrimLimit } from "@/functions/render-helper";
import type postInterface from "@/interface/auth/post.interface";
import { authClient } from "@/lib/auth-client";
import usePostStore from "@/store/post.store";
import useReportStore from "@/store/report.strore";
import ImagePreviewDialog from "../image-preview";
import DeleteModal from "../modal/delete.modal";
import EditModal from "../modal/edit.modal";
import CommentSkeleton from "../skeleton/comment.skelton";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
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
import { renderComments } from "./comment/render-comments";

interface PostCardProps {
  post: postInterface;
  index: number;
  expandedStates: boolean[];
  toggleExpand: (index: number) => void;
  commentShown: { [key: string]: boolean };
  toggleCommentShown: (postId: string) => void;
  expandedComments: { [key: string]: boolean };
  toggleCommentExpand: (commentId: string) => void;
  replyShown: { [key: string]: boolean };
  toggleReplyShown: (commentId: string) => void;
  replyContent: { [key: string]: string };
  setReplyContent: React.Dispatch<
    React.SetStateAction<{ [key: string]: string }>
  >;
  handleReplySubmit: (commentId: string) => void;
  expandedReplies: { [key: string]: boolean };
  toggleReplies: (commentId: string) => void;
  handleEditComment: (commentId: string) => void;
  handleDeleteComment: (commentId: string) => void;
  openEditModal: (comment: any) => void;
  openDeleteModal: (comment: any) => void;
  setSelectedCommentReply: (comment: any) => void;
  modalEditOpened: boolean;
  modalDeleteOpened: boolean;
  reportModalOpen: boolean;
  setReportModalOpen: (open: boolean) => void;
  commentLoading: boolean;
  comments: any[];
  hasNextCommentPage: boolean;
  isFetchingNextCommentPage: boolean;
  fetchNextCommentPage: () => void;
  setEditModal: (open: boolean) => void;
  setDeleteModal: (open: boolean) => void;
  changePostAccessType: (post: postInterface) => void;
  handleLike: (postId: string) => void;
  handleBookmark: (postId: string) => void;
  setCommentId: (id: string) => void;
}

const PostCard = ({
  post,
  index,
  expandedStates,
  toggleExpand,
  commentShown,
  toggleCommentShown,
  expandedComments,
  toggleCommentExpand,
  replyShown,
  toggleReplyShown,
  replyContent,
  setReplyContent,
  handleReplySubmit,
  expandedReplies,
  toggleReplies,
  handleEditComment,
  handleDeleteComment,
  openEditModal,
  openDeleteModal,
  setSelectedCommentReply,
  modalEditOpened,
  modalDeleteOpened,
  reportModalOpen,
  setReportModalOpen,
  commentLoading,
  comments,
  hasNextCommentPage,
  isFetchingNextCommentPage,
  fetchNextCommentPage,
  setEditModal,
  setDeleteModal,
  changePostAccessType,
  handleLike,
  handleBookmark,
  setCommentId,
}: PostCardProps) => {
  const router = useRouter();
  const session = authClient.useSession();
  const queryClient = useQueryClient();
  const { setSelectedPost, setContent } = usePostStore();
  const { setPostId } = useReportStore();
  const [commentContent, setCommentContent] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null);
  const [selectedPostImages, setSelectedPostImages] = useState<string[]>([]);
  const [optimisticLikes, setOptimisticLikes] = useState<{ [key: string]: boolean }>({});
  const [optimisticBookmarks, setOptimisticBookmarks] = useState<{ [key: string]: boolean }>({});
  const [isAccessDialogOpen, setIsAccessDialogOpen] = useState(false);
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}m`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k`;
    }
    return count.toString();
  };

  const contentWords = post.content.split(" ");
  const trimLimit = getTrimLimit();
  const truncatedContent = contentWords.slice(0, trimLimit).join(" ");
  const isLongContent = contentWords.length > trimLimit;
  const isShortContent = contentWords.length < trimLimit;
  const isTooShort = contentWords.length < 10;

  const likeMutation = useMutation({
    mutationFn: async (postId: string) => {
      const response = await axios.post("/api/post/like", {
        postId,
        userId: session.data?.user.id,
      });
      return response.data.data;
    },
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previousPosts = queryClient.getQueryData(["posts"]);

      // Optimistically update the UI
      setOptimisticLikes((prev) => ({
        ...prev,
        [postId]: !post.likes?.some(
          (like) => like.userId === session.data?.user.id,
        ),
      }));

      // Optimistically update the count
      queryClient.setQueryData(["posts"], (old: any) => {
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
      // Revert the optimistic update on error
      setOptimisticLikes((prev) => ({
        ...prev,
        [postId]: !optimisticLikes[postId],
      }));
      queryClient.setQueryData(["posts"], context?.previousPosts);
      toast.error("Error occurred while liking/unliking post");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
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
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previousPosts = queryClient.getQueryData(["posts"]);

      // Optimistically update the UI
      setOptimisticBookmarks((prev) => ({
        ...prev,
        [postId]: !post.bookmarks.some(
          (bookmark) => bookmark.userId === session.data?.user.id,
        ),
      }));

      // Optimistically update the count
      queryClient.setQueryData(["posts"], (old: any) => {
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
      // Revert the optimistic update on error
      setOptimisticBookmarks((prev) => ({
        ...prev,
        [postId]: !optimisticBookmarks[postId],
      }));
      queryClient.setQueryData(["posts"], context?.previousPosts);
      toast.error("Error occurred while bookmarking/unbookmarking post");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
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
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      const previousPosts = queryClient.getQueryData(["posts"]);

      // Optimistically update the comment count
      queryClient.setQueryData(["posts"], (old: any) => {
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
      // Revert the optimistic update on error
      queryClient.setQueryData(["posts"], context?.previousPosts);
      toast.error("Error occurred while adding comment");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["comment"] });
      setCommentContent("");
    },
  });

  const handleCommentSubmit = () => {
    if (commentContent.trim()) {
      commentMutation.mutate({
        postId: post.id,
        content: commentContent.trim(),
      });
    }
  };

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

  const handleUserProfileClick = (userId: string) => {
    router.push(`/user-profile/${userId}`);
  };

  const handleReport = (postId: string) => {
    setPostId(postId);
    setReportModalOpen(true);
  };

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

  const followMutation = useMutation({
    mutationFn: async ({
      userId,
      action,
    }: {
      userId: string;
      action: "follow" | "unfollow";
    }) => {
      const response = await axios.post(
        `/api/user/follow?userId=${userId}&action=${action}`,
      );
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate all relevant queries
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["who-to-follow"] });
      queryClient.invalidateQueries({ queryKey: ["follow-status"] });
      queryClient.invalidateQueries({ queryKey: ["user-followers"] });
      queryClient.invalidateQueries({ queryKey: ["user-following"] });
      queryClient.invalidateQueries({ queryKey: ["explore"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(data.message);
    },
    onError: () => {
      toast.error("Error occurred while following/unfollowing user");
    },
  });

  const handleFollow = (post: postInterface) => {
    if (!session.data?.user?.id) {
      toast.error("Please sign in to follow users");
      return;
    }
    if (session.data.user.id === post.user.id) {
      toast.error("You cannot follow yourself");
      return;
    }
    const isFollowing = post.user.isFollowingAuthor;
    followMutation.mutate({
      userId: post.user.id,
      action: isFollowing ? "unfollow" : "follow",
    });
  };
  const handleAccessChange = async () => {
    setIsAccessDialogOpen(true);
  };

  const onEmojiClick = (emojiObject: any) => {
    const text = commentContent;
    const before = text.slice(0, cursorPosition);
    const after = text.slice(cursorPosition);
    const newText = before + emojiObject.emoji + after;
    setCommentContent(newText);
    setCursorPosition(cursorPosition + emojiObject.emoji.length);
  };

  return (
    <div className="relative my-5 w-full flex-1 overflow-hidden rounded-2xl border border-gray-50 bg-white/90 shadow-sm backdrop-blur-sm transition-all dark:border-gray-500/5 dark:bg-black">
      <div className="absolute -right-10 -top-10 h-[200px] w-[200px] rotate-12 rounded-full bg-gradient-to-br from-primary/5 to-transparent blur-[80px]"></div>
      <div className="absolute -left-10 -bottom-10 h-[200px] w-[200px] -rotate-12 rounded-full bg-gradient-to-tl from-secondary/5 to-transparent blur-[80px]"></div>

      <div className="relative p-6">
        <div className="flex w-full flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute -inset-0.5 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-sm"></div>
              <Image
                src={post.user.image || "/user.jpg"}
                alt="user"
                className="relative size-10 cursor-pointer rounded-full ring-2 ring-white/90 transition-all hover:ring-primary dark:ring-gray-800/5 sm:size-12"
                height={200}
                width={200}
                onClick={() => handleUserProfileClick(post.user.id)}
              />
            </div>

            <div onClick={() => handleUserProfileClick(post.user.id)} className="cursor-pointer">
              <h1 className="font-geist text-base font-medium">{post.user.name}</h1>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>Nerd@</span>
                <span className="text-primary">{post.user.nerdAt}</span>
              </div>
            </div>
          </div>

          <div className="flex w-full items-center justify-end gap-2 sm:w-auto">
            {session?.data?.user?.id !== post.user.id && (
              <Button
                variant="outline"
                size="sm"
                className={`h-10 rounded-full px-4 text-sm font-medium transition-colors sm:h-11 ${
                  post.user?.isFollowingAuthor
                    ? "border-primary/50 text-primary hover:bg-primary/10"
                    : ""
                }`}
                onClick={() => handleFollow(post)}
              >
                <span className="flex items-center gap-2">
                  {!post.user?.isFollowingAuthor && <Plus className="size-4" />}
                  {post.user?.isFollowingAuthor ? "Following" : "Follow"}
                </span>
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-white/5"
                >
                  <MoreHorizontal className="size-5" />
                </Button>
              </DropdownMenuTrigger>
              {session?.data?.user?.id === post.user.id ? (
                <DropdownMenuContent
                  align="end"
                  className="w-48 rounded-xl border-gray-100 bg-white/90 shadow-lg backdrop-blur-sm dark:border-gray-500/5 dark:bg-black"
                >
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedPost(post);
                      setEditModal(true);
                    }}
                    className="flex h-11 cursor-pointer items-center gap-2 rounded-lg px-4 hover:bg-gray-100 dark:hover:bg-black"
                  >
                    <Edit className="size-4" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedPost(post);
                      setDeleteModal(true);
                    }}
                    className="flex h-11 cursor-pointer items-center gap-2 rounded-lg px-4 text-red-600 hover:bg-gray-100 dark:hover:bg-black"
                  >
                    <TrashIcon className="size-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                  {(post?.access as unknown as string) === (PostAccess.public as unknown as string) ? (
                    <DropdownMenuItem
                      onClick={handleAccessChange}
                      className="flex h-11 cursor-pointer items-center gap-2 rounded-lg px-4 hover:bg-gray-100 dark:hover:bg-black"
                    >
                      <LockIcon className="size-4" />
                      <span>Go Private</span>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={handleAccessChange}
                      className="flex h-11 cursor-pointer items-center gap-2 rounded-lg px-4 hover:bg-gray-100 dark:hover:bg-black"
                    >
                      <LockOpen className="size-4" />
                      <span>Go Public</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              ) : (
                <DropdownMenuContent
                  align="end"
                  className="w-48 rounded-xl border-gray-100 bg-white/90 shadow-lg backdrop-blur-sm dark:border-gray-500/10 dark:bg-black"
                >
                  <DropdownMenuItem
                    onClick={() => handleReport(post.id)}
                    className="flex h-11 cursor-pointer items-center gap-2 rounded-lg px-4 text-red-600 hover:bg-gray-100 dark:hover:bg-black"
                  >
                    <BanIcon className="size-4" />
                    <span>Report</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              )}
            </DropdownMenu>
          </div>
        </div>

        <div className="mt-6 flex w-full flex-col items-start justify-center">
          {post?.shared && (
            <Card
              onClick={() => router.push(`project/${post.project?.id}`)}
              className="mb-6 h-28 w-full overflow-hidden rounded-xl border-gray-100 bg-white/80 shadow-sm transition-all hover:cursor-pointer hover:shadow-md dark:border-gray-500/5 dark:bg-gray-900/80"
            >
              <div className="flex h-full gap-4">
                <div className="relative h-full w-28">
                  <Image
                    fill
                    src={post?.project?.image || "/placeholder.svg"}
                    alt={post?.project?.name as string}
                    className="object-cover"
                    sizes="112px"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between p-4">
                  <div>
                    <h3 className="line-clamp-1 font-geist text-lg font-medium tracking-tight">
                      {post?.project?.name}
                    </h3>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-primary/5 text-xs font-normal text-primary">
                        {post?.project?.status}
                      </Badge>
                      {post?.project?.category && (
                        <Badge variant="outline" className="bg-secondary/5 text-xs font-normal text-secondary">
                          {post?.project?.category}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="size-4" />
                      <span>{post?.project?._count.updates}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="size-4" />
                      <span>{post?.project?._count.stars}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="size-4" />
                      <span>{post?.project?._count.reviews}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {post.media && post.media.length > 0 && (
            <div className={`${!post.shared && "mt-4"} grid w-full gap-2 ${getGridClass(post.media.length)}`}>
              {post.media.length === 1 && (
                <div
                  className="relative h-[25vh] overflow-hidden rounded-xl sm:h-[30vh] md:h-[36vh]"
                  onClick={() =>
                    handleMediaClick(
                      0,
                      post.media.map((media) => media.url),
                    )
                  }
                >
                  <Image
                    fill
                    src={post.media[0].url || "/placeholder.svg"}
                    alt="Post media"
                    className="w-full object-cover transition-transform hover:scale-105"
                  />
                </div>
              )}
              {post.media.length === 2 &&
                post.media.map((media, mediaIndex) => (
                  <div
                    key={media.id}
                    className="relative h-[15vh] overflow-hidden rounded-xl sm:h-[20vh] md:h-[28vh]"
                    onClick={() =>
                      handleMediaClick(
                        mediaIndex,
                        post.media.map((media) => media.url),
                      )
                    }
                  >
                    <Image
                      fill
                      src={media.url || "/placeholder.svg"}
                      alt="Post media"
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                ))}
              {post.media.length >= 3 && (
                <div className="grid h-[30vh] w-full max-w-[82vw] grid-cols-[auto_100px] gap-1 sm:h-[36vh] sm:grid-cols-[auto_120px] sm:gap-2 md:w-[36vw]">
                  <div
                    className="relative h-full w-full overflow-hidden rounded-xl"
                    onClick={() =>
                      handleMediaClick(
                        0,
                        post.media.map((media) => media.url),
                      )
                    }
                  >
                    <Image
                      fill
                      src={post.media[0].url || "/placeholder.svg"}
                      alt="Post media"
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  </div>

                  <div className="flex w-full flex-col gap-1 sm:gap-2">
                    {post.media.slice(1, 4).map((media, mediaIndex) => (
                      <div
                        key={media.id}
                        className="relative h-full w-full overflow-hidden rounded-xl"
                        onClick={() =>
                          handleMediaClick(
                            mediaIndex + 1,
                            post.media.map((media) => media.url),
                          )
                        }
                      >
                        <Image
                          fill
                          src={media.url || "/placeholder.svg"}
                          alt="Post media"
                          className="h-full w-full object-cover transition-transform hover:scale-105"
                        />
                        {mediaIndex === 2 && post.media.length > 4 && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white">
                            <span className="text-lg font-medium">
                              +{post.media.length - 4}
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-4 w-full">
            <h4 className="whitespace-pre-wrap break-all font-geist text-base leading-relaxed text-foreground">
              {(expandedStates[index] || !isLongContent ? post.content : truncatedContent)
                .split(/(\s+)/)
                .map((word, i) =>
                  word.startsWith("#") ? (
                    <span key={i} className="text-primary">{word}</span>
                  ) : (
                    word
                  ),
                )}
              {!expandedStates[index] && isLongContent && "..."}
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

          <div className="mt-6 flex w-full items-center justify-start gap-6 border-t border-gray-100 pt-4 dark:border-gray-500/5">
            <motion.div
              className="flex cursor-pointer items-center gap-2"
              onClick={() => likeMutation.mutate(post.id)}
              variants={likeVariants}
              initial="initial"
              animate={
                optimisticLikes[post.id] !== undefined
                  ? optimisticLikes[post.id]
                    ? "liked"
                    : "initial"
                  : post.likes?.some(
                        (like) => like.userId === session.data?.user.id,
                      )
                    ? "liked"
                    : "initial"
              }
              whileHover="hover"
              whileTap="tap"
              transition={{ duration: 0.2 }}
            >
              {optimisticLikes[post.id] !== undefined ? (
                optimisticLikes[post.id] ? (
                  <GoHeartFill className="size-5 text-red-500" />
                ) : (
                  <GoHeart className="size-5" />
                )
              ) : post.likes?.some(
                  (like) => like.userId === session.data?.user.id,
                ) ? (
                <GoHeartFill className="size-5 text-red-500" />
              ) : (
                <GoHeart className="size-5" />
              )}
              <span className="font-geist text-sm font-medium">{formatCount(post._count?.likes || 0)}</span>
            </motion.div>

            <motion.div
              onClick={async () => {
                await setSelectedPost(post);
                toggleCommentShown(post.id);
                await queryClient.invalidateQueries({
                  queryKey: ["comment", post.id],
                });
              }}
              className="flex cursor-pointer items-center gap-2"
              variants={iconVariants}
              whileHover="hover"
              whileTap="tap"
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="size-5" />
              <span className="font-geist text-sm font-medium">{formatCount(post._count?.replies || 0)}</span>
            </motion.div>

            <motion.div
              className="flex cursor-pointer items-center gap-2"
              onClick={() => bookmarkMutation.mutate(post.id)}
              variants={bookmarkVariants}
              initial="initial"
              animate={
                optimisticBookmarks[post.id] !== undefined
                  ? optimisticBookmarks[post.id]
                    ? "bookmarked"
                    : "initial"
                  : post.bookmarks.some(
                        (bookmark) => bookmark.userId === session.data?.user.id,
                      )
                    ? "bookmarked"
                    : "initial"
              }
              whileHover="hover"
              whileTap="tap"
              transition={{ duration: 0.2 }}
            >
              {optimisticBookmarks[post.id] !== undefined ? (
                optimisticBookmarks[post.id] ? (
                  <HiBookmark className="size-5 text-primary" />
                ) : (
                  <HiOutlineBookmark className="size-5" />
                )
              ) : post.bookmarks.some(
                  (bookmark) => bookmark.userId === session.data?.user.id,
                ) ? (
                <HiBookmark className="size-5 text-primary" />
              ) : (
                <HiOutlineBookmark className="size-5" />
              )}
              <span className="font-geist text-sm font-medium">{formatCount(post._count?.bookmarks || 0)}</span>
            </motion.div>
          </div>
        </div>

        {commentShown[post.id] && (
          <div className="mt-6 border-t border-gray-100 pt-6 dark:border-gray-500/5">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <input
                  placeholder="Write a comment..."
                  className="w-full rounded-full border border-gray-100 bg-white/50 px-4 py-2.5 text-sm placeholder:font-geist placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-gray-500/5 dark:bg-card/50"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e?.target?.value)}
                  onSelect={(e) => setCursorPosition(e?.currentTarget?.selectionStart || 0)}
                />
                <div className="absolute bottom-2 right-3">
                  <Popover onOpenChange={setIsEmojiOpen} open={isEmojiOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 rounded-full p-0 text-muted-foreground hover:bg-gray-100 dark:hover:bg-black"
                      >
                        <SmileIcon className="size-4" />
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
                onClick={handleCommentSubmit}
                className="h-10 w-10 rounded-full bg-primary text-white shadow-none hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90"
              >
                <SendIcon className="size-4" />
              </Button>
            </div>

            {commentLoading && <CommentSkeleton />}

            <div className="mt-6 space-y-4">
              {renderComments({
                comments: comments,
                parentId: null,
                level: 0,
                expandedComments,
                toggleCommentExpand,
                replyShown,
                toggleReplyShown,
                replyContent,
                setReplyContent,
                handleReplySubmit,
                expandedReplies,
                toggleReplies,
                handleEditComment,
                handleDeleteComment,
                openEditModal,
                openDeleteModal,
                setSelectedCommentReply,
                modalEditOpened,
                modalDeleteOpened,
                reportModalOpen,
                setReportModalOpen,
                setCommentId,
              })}

              {hasNextCommentPage && (
                <Button
                  onClick={() => fetchNextCommentPage()}
                  disabled={isFetchingNextCommentPage}
                  variant="outline"
                  className="mt-4 h-10 w-full rounded-full border-gray-100 bg-white/50 text-sm font-medium hover:bg-gray-50 disabled:opacity-50 dark:border-gray-500/5 dark:bg-card/50 dark:hover:bg-black"
                >
                  {isFetchingNextCommentPage ? "Loading..." : "Load More Comments"}
                </Button>
              )}
            </div>
          </div>
        )}

        <ImagePreviewDialog
          images={selectedPostImages}
          initialIndex={selectedMediaIndex || 0}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />

        <Dialog open={isAccessDialogOpen} onOpenChange={setIsAccessDialogOpen}>
          <DialogContent className="max-w-md overflow-hidden rounded-xl border-none p-0 backdrop-blur-sm">
            <DialogTitle></DialogTitle>
            <div className="relative flex flex-col">
              <div className="absolute -right-4 size-32 -rotate-45 rounded-full border border-primary/50 bg-gradient-to-br from-primary/40 via-primary/50 to-transparent blur-[150px] backdrop-blur-sm"></div>
              <div className="absolute -bottom-5 left-12 size-32 rotate-45 rounded-full border border-secondary/50 bg-gradient-to-tl from-secondary/40 via-secondary/30 to-transparent blur-[150px] backdrop-blur-sm"></div>

              <div className="flex w-full flex-col px-6 pb-3">
                <div className="mb-2 font-geist text-3xl font-medium">
                  {(post.access as unknown as string) === (PostAccess.public as unknown as string)
                    ? "Make Post Private"
                    : "Make Post Public"}
                </div>
                <p className="mb-6 font-geist text-muted-foreground">
                  {(post.access as unknown as string) === (PostAccess.public as unknown as string)
                    ? "Are you sure you want to make this post private? This will hide it from other users."
                    : "Are you sure you want to make this post public? This will make it visible to other users."}
                </p>

                <div className="mt-8 flex justify-end gap-3 border-t border-gray-100 pt-4 font-geist dark:border-gray-500/5">
                  <Button
                    variant="outline"
                    className="h-11 w-24 rounded-2xl"
                    onClick={() => setIsAccessDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={async () => {
                      await changePostAccessType(post);
                      setIsAccessDialogOpen(false);
                    }}
                    className="h-11 w-24 rounded-2xl bg-primary text-white hover:bg-primary/90"
                  >
                    Confirm
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <EditModal
        incasePost={post}
        setEditModal={setEditModal}
        editModal={modalEditOpened}
        incaseContent={post.content}
      />

      <DeleteModal
        selectedPost={post}
        setDeleteModal={setDeleteModal}
        deleteModal={modalDeleteOpened}
        content={post.content}
        setContent={setContent}
      />
    </div>
  );
};

export default PostCard;
