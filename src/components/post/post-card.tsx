"use client";

import type React from "react";

import { getTrimLimit } from "@/functions/render-helper";
import type postInterface from "@/interface/auth/post.interface";
import { authClient } from "@/lib/auth-client";
import usePostStore from "@/store/post.store";
import useReportStore from "@/store/report.strore";
import { PostAccess } from "@prisma/client";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { motion } from "framer-motion";
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
  Star,
  TrashIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { HiBookmark, HiOutlineBookmark } from "react-icons/hi2";
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
import { renderComments } from "./comment/render-comments";
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
import { SmileIcon } from "lucide-react";

const timeAgo = (date: Date) => {
  const seconds = Math.floor(
    (new Date().getTime() - new Date(date).getTime()) / 1000,
  );

  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y";

  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo";

  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d";

  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h";

  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m";

  return Math.floor(seconds) + "s";
};

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
  setCommentId,
}: PostCardProps) => {
  const router = useRouter();
  const session = authClient.useSession();
  const queryClient = useQueryClient();
  const { setSelectedPost, setContent } = usePostStore();
  const { setPostId } = useReportStore();
  const [commentContent, setCommentContent] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(
    null,
  );
  const [selectedPostImages, setSelectedPostImages] = useState<string[]>([]);
  const [optimisticLikes, setOptimisticLikes] = useState<{
    [key: string]: boolean;
  }>({});
  const [optimisticBookmarks, setOptimisticBookmarks] = useState<{
    [key: string]: boolean;
  }>({});
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
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["who-to-follow"] });
      queryClient.invalidateQueries({ queryKey: ["follow-status"] });
      queryClient.invalidateQueries({ queryKey: ["user-followers"] });
      queryClient.invalidateQueries({ queryKey: ["user-following"] });
      queryClient.invalidateQueries({ queryKey: ["explore"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user-data"] });
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
    <div className="after:top-0 [&>*:last-child]:after:top-0 before:right-0 [&>*:last-child]:after:right-[-17px] before:bottom-0 after:left-0 before:absolute after:absolute [&>*:last-child]:after:absolute relative flex-1 before:bg-gradient-to-r after:bg-gradient-to-b [&>*:last-child]:after:bg-gradient-to-b before:from-transparent after:from-transparent [&>*:last-child]:after:from-transparent before:via-orange-500/10 after:via-blue-500/20 [&>*:last-child]:after:via-blue-500/20 before:to-transparent after:to-transparent [&>*:last-child]:after:to-transparent my-5 p-2 sm:p-4 px-2 sm:px-3 border-transparent border-b w-full before:w-full after:w-[1px] [&>*:last-child]:after:w-[1px] before:h-[1px] after:h-full [&>*:last-child]:after:h-full">
      <div className="absolute inset-0 overflow-visible pointer-events-none">
        {/* Only render these effects on desktop for better performance */}
        <div className="hidden md:block">
          <div className="-right-4 absolute bg-gradient-to-br from-blue-300/20 via-blue-400/30 to-transparent opacity-60 blur-[100px] rounded-full size-40 -rotate-45"></div>
          <div className="-bottom-5 left-12 absolute bg-gradient-to-tl from-orange-300/20 via-orange-400/20 to-transparent opacity-60 blur-[100px] rounded-full size-40 rotate-45"></div>
        </div>
      </div>

      <div className="relative sm:pl-5 md:pl-3">
        <div className="flex sm:flex-row flex-col justify-between items-start sm:items-center gap-2 sm:gap-0 mr-2 pb-2 w-full">
          <div className="flex flex-1 items-center gap-2 sm:gap-3">
            <Image
              src={post.user.image || "/user.jpg"}
              alt="user"
              className="shadow-[0_0_3px_rgba(0,122,255,0.5),0_0_5px_rgba(255,165,0,0.5),0_0_7px_rgba(0,122,255,0.4)] rounded-full size-8 sm:size-10 transition-all cursor-pointer"
              height={200}
              width={200}
              onClick={() => handleUserProfileClick(post.user.id)}
            />

            <div
              onClick={() => handleUserProfileClick(post.user.id)}
              className="cursor-pointer"
            >
              <h1 className="font-medium text-xs sm:text-sm">
                {post.user.name}
              </h1>
              <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground sm:text-xs">
                <span>
                  Nerd@
                  <span className="text-purple-500">{post.user.nerdAt}</span>
                </span>
                <span>·</span>
                <span>{timeAgo(post.createdAt)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {session?.data?.user?.id !== post.user.id &&
              !post.user?.isFollowingAuthor && (
                <Button
                  variant={"outline"}
                  size="sm"
                  className={`h-9 w-full rounded-xl bg-transparent px-2 text-xs shadow-none hover:bg-transparent sm:h-11 sm:w-auto md:text-sm`}
                  onClick={() => {
                    handleFollow(post);
                  }}
                  disabled={followMutation.isPending}
                >
                  <span className="flex items-center gap-1 px-2">
                    {followMutation.isPending ? (
                      <div className="border-2 border-current border-t-transparent rounded-full size-3 animate-spin" />
                    ) : (
                      <Plus size={15} />
                    )}
                    {followMutation.isPending ? "Following..." : "Follow"}
                  </span>
                </Button>
              )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-7 sm:w-8 h-7 sm:h-8"
                >
                  <MoreHorizontal className="w-3 sm:w-4 h-3 sm:h-4" />
                </Button>
              </DropdownMenuTrigger>
              {session?.data?.user?.id === post.user.id ? (
                <DropdownMenuContent
                  align="end"
                  className="bg-white/80 dark:bg-black/80 shadow-lg backdrop-blur-sm border-none rounded-2xl w-48"
                >
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedPost(post);
                      setEditModal(true);
                    }}
                    className="hover:bg-black/70 rounded-xl h-10 cursor-pointer"
                  >
                    <Edit className="mr-2 w-4 h-4" />
                    <span>Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedPost(post);
                      setDeleteModal(true);
                    }}
                    className="hover:bg-black/70 rounded-xl h-10 cursor-pointer"
                  >
                    <TrashIcon className="mr-2 w-4 h-4" />
                    <span>Delete</span>
                  </DropdownMenuItem>
                  {(post?.access as unknown as string) ===
                  (PostAccess.public as unknown as string) ? (
                    <DropdownMenuItem
                      onClick={() => {
                        handleAccessChange();
                      }}
                      className="hover:bg-black/70 rounded-xl h-10 cursor-pointer"
                    >
                      <LockIcon className="mr-2 w-4 h-4" />
                      <span>Go Private</span>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={() => {
                        handleAccessChange();
                      }}
                      className="hover:bg-black/70 rounded-xl h-10 cursor-pointer"
                    >
                      <LockOpen className="mr-2 w-4 h-4" />
                      <span>Go Public</span>
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              ) : (
                <DropdownMenuContent
                  align="end"
                  className="bg-white/80 dark:bg-black/80 shadow-lg backdrop-blur-sm border-none rounded-2xl w-48"
                >
                  <DropdownMenuItem
                    onClick={() => handleReport(post.id)}
                    disabled={session?.data?.user?.id === post.user.id}
                    className="hover:bg-black/70 rounded-xl h-10 cursor-pointer"
                  >
                    <BanIcon className="mr-2 w-4 h-4" />
                    <span>Report</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              )}
            </DropdownMenu>
          </div>
        </div>

        <div
          className={`mt-2 flex w-full flex-1 flex-col items-start justify-center`}
        >
          <div className="flex flex-col flex-1 justify-start gap-3 w-[100%]">
            {post?.shared && (
              <Card
                onClick={() => router.push(`project/${post.project?.id}`)}
                className="opacity-80 hover:opacity-100 shadow-none border-gray-100 dark:border-gray-500/5 h-24 overflow-hidden transition-all hover:cursor-pointer"
              >
                <div className="flex gap-3 h-full">
                  <div className="relative w-24 h-full">
                    <img
                      src={post?.project?.image || "/placeholder.svg"}
                      alt={post?.project?.name as string}
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col flex-1 justify-between p-2">
                    <div>
                      <h3 className="font-medium text-sm line-clamp-1 tracking-tight">
                        {post?.project?.name}
                      </h3>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <Badge
                          variant="outline"
                          className="bg-primary/5 font-normal text-[10px]"
                        >
                          {post?.project?.status}
                        </Badge>
                        {post?.project?.category && (
                          <Badge
                            variant="outline"
                            className="bg-primary/5 font-normal text-[10px]"
                          >
                            {post?.project?.category}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-muted-foreground text-xs">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{post?.project?._count.updates}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        <span>{post?.project?._count.stars}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        <span>{post?.project?._count.reviews}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}
            {post.media && post.media.length > 0 && (
              <div className={`${!post.shared && "mt-2 sm:mt-4"} w-full`}>
                {/* 1 Image - Full width */}
                {post.media.length === 1 && (
                  <div
                    className="relative w-full aspect-video"
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
                      className="rounded-xl object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                )}

                {/* 2 Images - Equal split */}
                {post.media.length === 2 && (
                  <div className="gap-1 sm:gap-2 grid grid-cols-2">
                    {post.media.map((media, mediaIndex) => (
                      <div
                        key={media.id}
                        className="relative aspect-square"
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
                          className="rounded-xl object-cover"
                          sizes="(max-width: 768px) 50vw, 25vw"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* 3+ Images - Main + Side thumbnails */}
                {post.media.length >= 3 && (
                  <div className="gap-1 sm:gap-2 grid grid-cols-3 aspect-video">
                    {/* Main image (2/3 width) */}
                    <div
                      className="relative col-span-2 h-full"
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
                        className="rounded-xl object-cover"
                        sizes="(max-width: 768px) 66vw, 33vw"
                      />
                    </div>

                    {/* Thumbnail column (1/3 width) */}
                    <div className="gap-1 sm:gap-2 grid grid-rows-2 h-full">
                      {/* Always show 2nd and 3rd images */}
                      {post.media.slice(1, 3).map((media, mediaIndex) => (
                        <div
                          key={media.id}
                          className="relative w-full h-full"
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
                            className="rounded-xl object-cover"
                            sizes="(max-width: 768px) 33vw, 16vw"
                          />
                        </div>
                      ))}

                      {/* Show 4th image if exists (without +X badge) */}
                      {post.media.length === 4 && (
                        <div
                          className="relative"
                          onClick={() =>
                            handleMediaClick(
                              3,
                              post.media.map((media) => media.url),
                            )
                          }
                        >
                          <Image
                            fill
                            src={post.media[3].url || "/placeholder.svg"}
                            alt="Post media"
                            className="rounded-xl object-cover"
                            sizes="(max-width: 768px) 33vw, 16vw"
                          />
                        </div>
                      )}

                      {/* Show +X badge only when there are more than 4 images */}
                      {post.media.length > 4 && (
                        <div
                          className="relative"
                          onClick={() =>
                            handleMediaClick(
                              3,
                              post.media.map((media) => media.url),
                            )
                          }
                        >
                          <Image
                            fill
                            src={post.media[3].url || "/placeholder.svg"}
                            alt="Post media"
                            className="rounded-xl object-cover"
                            sizes="(max-width: 768px) 33vw, 16vw"
                          />
                          <div className="absolute inset-0 flex justify-center items-center bg-black/50 rounded-xl font-semibold text-white text-sm">
                            +{post.media.length - 4}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex-1 break-words">
              <h4 className="text-xs sm:text-sm md:text-sm break-all whitespace-pre-wrap">
                {(expandedStates[index] || !isLongContent
                  ? post.content
                  : truncatedContent
                )
                  .split(/(\s+)/)
                  .map((word, i) =>
                    word.startsWith("#") ? (
                      <span key={i} className="text-purple-500">
                        {word}
                      </span>
                    ) : (
                      word
                    ),
                  )}
                {!expandedStates[index] && isLongContent && "..."}
              </h4>
              {isLongContent && (
                <button
                  className="mt-1 sm:mt-2 text-purple-500 text-xs sm:text-sm hover:underline"
                  onClick={() => toggleExpand(index)}
                >
                  {expandedStates[index] ? "See less" : "See more"}
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-start items-center gap-6 mt-4 pt-3 border-t border-t-gray-500/10 w-full">
            <motion.div
              className="flex items-center gap-2 cursor-pointer"
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
              <span className="font-medium text-sm">
                {formatCount(post._count?.likes || 0)}
              </span>
            </motion.div>

            <motion.div
              onClick={async () => {
                await setSelectedPost(post);
                toggleCommentShown(post.id);
                await queryClient.invalidateQueries({
                  queryKey: ["comment", post.id],
                });
              }}
              className="flex items-center gap-2 cursor-pointer"
              variants={iconVariants}
              whileHover="hover"
              whileTap="tap"
              transition={{ duration: 0.2 }}
            >
              <MessageCircle className="size-5" />
              <span className="font-medium text-sm">
                {formatCount(post._count?.postcomments || 0)}
              </span>
            </motion.div>

            <motion.div
              className="flex items-center gap-2 cursor-pointer"
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
              <span className="font-medium text-sm">
                {formatCount(post._count?.bookmarks || 0)}
              </span>
            </motion.div>
          </div>
        </div>

        {commentShown[post.id] && (
          <div>
            <hr className="mt-3 sm:mt-5 mb-2" />
            <div className="flex gap-2 py-2 itemc">
              <div className="relative flex-1">
                <input
                  placeholder="Comment here"
                  className="bg-transparent px-2 py-2 border-0 focus:border-gray-500 dark:border-white/50 border-b border-b-textAlternative/20 focus:border-b focus:outline-none focus:ring-0 w-full placeholder:font-instrument text-xs sm:text-sm placeholder:text-base sm:placeholder:text-lg"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e?.target?.value)}
                  onSelect={(e) =>
                    setCursorPosition(e?.currentTarget?.selectionStart || 0)
                  }
                />
                <div className="right-2 bottom-1 absolute">
                  <Popover onOpenChange={setIsEmojiOpen} open={isEmojiOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-gray-100 dark:hover:bg-gray-800 p-0 rounded-lg w-6 h-6 font-medium text-gray-600 dark:text-gray-300 text-sm"
                      >
                        <SmileIcon className="w-4 h-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-fit">
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
                className="bg-transparent hover:bg-transparent shadow-none border focus:outline-none focus:ring-0 h-8 sm:h-9"
              >
                <SendIcon className="size-4 sm:size-5 text-card-foreground dark:text-white" />
              </Button>
            </div>
            {commentLoading && <CommentSkeleton />}
            <div className="mt-3 sm:mt-4">
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
                modalEditOpened: modalEditOpened,
                modalDeleteOpened: modalDeleteOpened,
                reportModalOpen,
                setReportModalOpen,
                setCommentId: (id: string) => setCommentId(id),
              })}
              {hasNextCommentPage && (
                <Button
                  onClick={() => fetchNextCommentPage()}
                  disabled={isFetchingNextCommentPage}
                  className="mt-3 sm:mt-4 w-full h-8 sm:h-9 text-xs sm:text-sm"
                >
                  {isFetchingNextCommentPage ? "Loading..." : "Load More"}
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
          <DialogContent className="backdrop-blur-sm p-0 border-none rounded-xl max-w-md overflow-hidden">
            <DialogTitle></DialogTitle>
            {/* Optimized gradient effects */}
            <div className="absolute inset-0 overflow-visible pointer-events-none">
              <div className="-right-4 absolute bg-gradient-to-br from-red-300/40 via-red-400/50 to-transparent opacity-80 blur-[100px] rounded-full size-40 -rotate-45" />
              <div className="-bottom-5 left-12 absolute bg-gradient-to-tl from-orange-300/40 via-orange-400/30 to-transparent opacity-80 blur-[100px] rounded-full size-40 rotate-45" />
            </div>
            <div className="relative flex flex-col">
              <div className="flex flex-col px-6 pb-3 w-full">
                <div className="mb-2 font-geist font-medium text-3xl">
                  {(post.access as unknown as string) ===
                  (PostAccess.public as unknown as string)
                    ? "Make Post Private"
                    : "Make Post Public"}
                </div>
                <p className="mb-6 font-geist text-muted-foreground">
                  {(post.access as unknown as string) ===
                  (PostAccess.public as unknown as string)
                    ? "Are you sure you want to make this post private? This will hide it from other users."
                    : "Are you sure you want to make this post public? This will make it visible to other users."}
                </p>

                <div className="flex justify-end gap-3 mt-8 pt-4 dark:border-gray-500/5 border-t font-geist">
                  <Button
                    variant="outline"
                    className="rounded-2xl w-24 h-11"
                    onClick={() => setIsAccessDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={async () => {
                      await changePostAccessType(post);
                      setIsAccessDialogOpen(false);
                    }}
                    className="rounded-2xl w-24 h-11"
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
