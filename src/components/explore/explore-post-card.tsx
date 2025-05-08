import { getTrimLimit } from "@/functions/render-helper";
import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/providers/tanstack-query-provider";
import usePostStore from "@/store/post.store";
import { postAccess } from "@/interface/auth/post.interface";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
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
  Share2Icon,
  Star,
  TrashIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { HiBookmark, HiOutlineBookmark } from "react-icons/hi2";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import ImagePreviewDialog from "../image-preview";
import CommentSkeleton from "../skeleton/comment.skelton";
import { renderComments } from "../post/comment/render-comments";

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
import { motion } from "framer-motion";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import PostCommentInterface from "@/interface/auth/comment.interface";
import postInterface from "@/interface/auth/post.interface";

interface ExplorePostCardProps {
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
  openEditModal: (comment: PostCommentInterface) => void;
  openDeleteModal: (comment: PostCommentInterface) => void;
  setSelectedCommentReply: (comment: PostCommentInterface) => void;
  modalEditOpened: boolean;
  modalDeleteOpened: boolean;
  reportModalOpen: boolean;
  setReportModalOpen: (open: boolean) => void;
  setCommentId: (id: string) => void;
  commentLoading: boolean;
  comments: PostCommentInterface[];
  hasNextCommentPage: boolean;
  isFetchingNextCommentPage: boolean;
  fetchNextCommentPage: () => void;
  setEditModal: (open: boolean) => void;
  setDeleteModal: (open: boolean) => void;
  changePostAccessType: (post: postInterface) => void;
  handleFollow: (post: postInterface) => void;
}

const ExplorePostCard = ({
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
  setCommentId,
  commentLoading,
  comments,
  hasNextCommentPage,
  isFetchingNextCommentPage,
  fetchNextCommentPage,
  setEditModal,
  setDeleteModal,
  changePostAccessType,
  handleFollow,
}: ExplorePostCardProps) => {
  const router = useRouter();
  const session = authClient.useSession();
  const { setSelectedPost, setContent } = usePostStore();
  const [commentContent, setCommentContent] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null);
  const [selectedPostImages, setSelectedPostImages] = useState<string[]>([]);
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);

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

      const isLiked = post.likes.some(
        (like) => like.userId === session.data?.user.id,
      );

      const updatedPost = {
        ...post,
        likes: isLiked
          ? post.likes.filter((like) => like.userId !== session.data?.user.id)
          : [
              ...post.likes,
              {
                id: Date.now().toString(),
                postId,
                userId: session.data?.user?.id || "",
              },
            ],
      };

      queryClient.setQueryData(["posts"], (old: unknown) => {
        if (!old) return old;
        const typedOld = old as {
          pages: {
            data: postInterface[];
          }[];
        };
        return {
          ...typedOld,
          pages: typedOld.pages.map((page) => ({
            ...page,
            data: page.data.map((p) =>
              p.id === postId ? updatedPost : p,
            ),
          })),
        };
      });

      return { previousPosts, updatedPost };
    },
    onError: (err, postId, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
      toast.error("Error occurred while liking/unliking post");
    },
    onSettled: () => {
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

      const isBookmarked = post.bookmarks.some(
        (bookmark) => bookmark.userId === session.data?.user.id,
      );

      const updatedPost = {
        ...post,
        bookmarks: isBookmarked
          ? post.bookmarks.filter(
              (bookmark) => bookmark.userId !== session.data?.user.id,
            )
          : [
              ...post.bookmarks,
              {
                id: Date.now().toString(),
                postId,
                userId: session.data?.user?.id || "",
              },
            ],
      };

      queryClient.setQueryData(["posts"], (old: unknown) => {
        if (!old) return old;
        const typedOld = old as {
          pages: {
            data: postInterface[];
          }[];
        };
        return {
          ...typedOld,
          pages: typedOld.pages.map((page) => ({
            ...page,
            data: page.data.map((p) =>
              p.id === postId ? updatedPost : p,
            ),
          })),
        };
      });

      return { previousPosts };
    },
    onError: (err, postId, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
      toast.error("Error occurred while bookmarking/unbookmarking post");
    },
    onSettled: () => {
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comment"] });
      setCommentContent("");
    },
    onError: () => {
      toast.error("Error occurred while adding comment");
    },
  });

  const handleLike = (postId: string) => {
    likeMutation.mutate(postId);
  };

  const handleBookmark = (postId: string) => {
    bookmarkMutation.mutate(postId);
  };

  const handleCommentSubmit = () => {
    if (commentContent) {
      commentMutation.mutate({
        postId: post.id,
        content: commentContent,
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
    setCommentId(postId);
    setReportModalOpen(true);
  };

  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
      return (count / 1000).toFixed(1) + 'K';
    } else {
      return count.toString();
    }
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-card/40 shadow-sm hover:shadow-lg backdrop-blur-sm border-border/50 dark:border-border/5 rounded-xl overflow-hidden transition-all duration-300"
    >
     

      <div className="relative backdrop-blur-sm p-4 sm:p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={post.user.image || "/user.jpg"} alt={post.user.name} />
              <AvatarFallback>{post.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div onClick={() => handleUserProfileClick(post.user.id)} className="cursor-pointer">
              <h1 className="font-medium text-sm sm:text-base">{post.user.name}</h1>
              <h1 className="text-muted-foreground text-purple-500 text-xs">
                Nerd@<span className="text-white">{post.user.nerdAt}</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {session?.data?.user?.id !== post.user.id && (
              <Button
                variant="outline"
                size="sm"
                className="bg-transparent hover:bg-transparent shadow-none mx-0 px-2 py-1 rounded-lg text-xs md:text-sm"
                onClick={() => handleFollow(post)}
              >
                {!post.user?.isFollowingAuthor && <Plus size={15} />}
                {post.user?.isFollowingAuthor ? "Following" : "Follow"}
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger className="mx-auto py-0 outline-none w-9">
                <MoreHorizontal />
              </DropdownMenuTrigger>
              {session?.data?.user?.id === post.user.id ? (
                <DropdownMenuContent className="md:block flex flex-row bg-white dark:bg-textAlternative mr-5 md:mr-0">
                  <DropdownMenuItem onClick={() => {
                      setSelectedPost(post);
                      setContent(post.content);
                      setEditModal(true);
                  }}>
                    <Edit className="mr-2 w-4 h-4" />
                    <span className="hidden md:block">Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => {
                      setSelectedPost(post);
                      setContent(post.content);
                      setDeleteModal(true);
                  }}>
                    <TrashIcon className="mr-2 w-4 h-4" />
                    <span className="hidden md:block">Delete</span>
                  </DropdownMenuItem>
                  {(post?.access as unknown as string) === (postAccess.public as unknown as string) ? (
                    <DropdownMenuItem onClick={() => changePostAccessType(post)}>
                      <LockIcon className="mr-2 w-4 h-4" />
                      <span className="hidden md:block">Go Private</span>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => changePostAccessType(post)}>
                      <LockOpen className="mr-2 w-4 h-4" />
                      <span className="hidden md:block">Go Public</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>
                    <Share2Icon className="mr-2 w-4 h-4" />
                    <span className="hidden md:block">Share</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              ) : (
                <DropdownMenuContent className="md:block flex flex-row justify-center bg-white dark:bg-textAlternative mr-5 md:mr-0">
                  <DropdownMenuItem>
                    <Share2Icon className="mr-2 w-4 h-4" />
                    <span className="hidden md:block">Share</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleReport(post.id)} disabled={session?.data?.user?.id === post.user.id}>
                    <BanIcon className="mr-2 w-4 h-4" />
                    <span className="hidden md:block">Report</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              )}
            </DropdownMenu>
          </div>
        </div>

        <div className="space-y-4">
            {post?.shared && (
              <Card
              onClick={() => router.push(`project/${post.project?.id}`)}
                className="opacity-80 hover:opacity-100 shadow-none border-gray-100 dark:border-gray-500/5 overflow-hidden transition-all hover:cursor-pointer"
              >
                <div className="flex sm:flex-row flex-col gap-3">
                  <div className="relative w-full sm:w-1/3 h-48 sm:h-auto">
                    <Image
                      fill
                      src={post?.project?.image || "/placeholder.svg"}
                      alt={post?.project?.name as string}
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  </div>
                  <div className="flex flex-col flex-1 justify-between p-4">
                    <div className="space-y-2">
                    <h3 className="font-medium tracking-tight">{post?.project?.name}</h3>
                      <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="bg-primary/5 font-normal text-xs">
                          {post?.project?.status}
                        </Badge>
                        {post?.project?.category && (
                        <Badge variant="outline" className="bg-primary/5 font-normal text-xs">
                            {post?.project?.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-4 text-muted-foreground text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{post?.project?._count.updates}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5" />
                        <span>{post?.project?._count.stars}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5" />
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
                    className="relative p-1 border border-border rounded-2xl w-fit"
                    onClick={() =>
                      handleMediaClick(
                        0,
                        post.media.map((media) => media.url),
                      )
                    }
                  >
                    <Image
                      src={post.media[0].url || "/placeholder.svg"}
                      width={400}
                      height={500}
                      alt="Post media"
                      className="rounded-xl object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{
                        width: "auto",
                        height: "auto",
                        maxHeight: "400px",
                      }}
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
                    <div
                      className={`grid h-full ${post.media.length === 3 ? "grid-rows-2" : "grid-rows-3"} gap-1 sm:gap-2`}
                    >
                      {post.media
                        .slice(1, post.media.length === 4 ? 4 : 3)
                        .map((media, mediaIndex) => (
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
                            {mediaIndex === 2 && post.media.length > 4 && (
                              <div className="absolute inset-0 flex justify-center items-center bg-black/50 rounded-xl font-semibold text-white text-sm">
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
              <h4 className="text-sm md:text-base break-all">
              {(expandedStates[index] || !isLongContent ? post.content : truncatedContent)
                .split(/(\s+)/)
                .map((word, i) => (
                  word.startsWith('#') 
                    ? <span key={i} className="text-purple-500">{word}</span>
                    : word
                ))}
                {!expandedStates[index] && isLongContent && '...'}
              </h4>
              {isLongContent && (
                <button
                  className="mt-2 text-purple-500 text-sm hover:underline"
                  onClick={() => toggleExpand(index)}
                >
                  {expandedStates[index] ? "See less" : "See more"}
                </button>
              )}
          </div>

          <div className="flex items-center gap-4 text-muted-foreground text-xs">
            <div
              className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
              onClick={() => handleLike(post.id)}
            >
              {post.likes?.some((like) => like.userId === session.data?.user.id) ? (
                <GoHeartFill className="w-4 h-4 text-red-500" />
              ) : (
                <GoHeart className="w-4 h-4" />
              )}
              <span>{formatCount(post._count?.likes || 0)}</span>
            </div>
            <div
              className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
              onClick={async () => {
                await setSelectedPost(post);
                toggleCommentShown(post.id);
                await queryClient.invalidateQueries({
                  queryKey: ["comment", post.id],
                });
              }}
            >
              <MessageCircle className="w-4 h-4" />
              <span>{formatCount(post._count?.replies || 0)}</span>
            </div>
            <div
              className="flex items-center gap-1 hover:text-primary transition-colors cursor-pointer"
              onClick={() => handleBookmark(post.id)}
            >
              {post.bookmarks.some((bookmark) => bookmark.userId === session.data?.user.id) ? (
                <HiBookmark className="w-4 h-4 text-primary" />
              ) : (
                <HiOutlineBookmark className="w-4 h-4" />
              )}
              <span>{formatCount(post._count?.bookmarks || 0)}</span>
            </div>
            </div>
          </div>
        </div>

        {commentShown[post.id] && (
          <div>
            <hr className="mt-5 mb-2" />
            <div className="flex gap-2 py-2 itemc">
              <div className="relative flex-1">
                <input
                  placeholder="Comment here"
                  className="bg-transparent px-2 py-2 border-0 focus:border-gray-500 dark:border-white/50 border-b border-b-textAlternative/20 focus:border-b focus:outline-none focus:ring-0 w-full placeholder:font-instrument text-sm placeholder:text-lg"
                  value={commentContent}
                  onChange={(e) => setCommentContent(e?.target?.value)}
                  onSelect={(e) => setCursorPosition(e?.currentTarget?.selectionStart || 0)}
                />
                <div className="right-2 bottom-1 absolute">
                  <Popover onOpenChange={setIsEmojiOpen} open={isEmojiOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="p-0 rounded-lg w-6 h-6 font-medium text-gray-600 dark:text-gray-300 text-sm"
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
                className="bg-transparent hover:bg-transparent shadow-none border focus:outline-none focus:ring-0"
              >
                <SendIcon className="text-card-foreground dark:text-white" />
              </Button>
            </div>
            {commentLoading && <CommentSkeleton />}
            <div className="mt-4">
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
              } as const)}
              {hasNextCommentPage && (
                <Button
                  onClick={() => fetchNextCommentPage()}
                  disabled={isFetchingNextCommentPage}
                  className="mt-4 w-full"
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
    </motion.div>
  );
};

export default ExplorePostCard;
