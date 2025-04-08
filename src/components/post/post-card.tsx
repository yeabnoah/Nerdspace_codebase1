import { getTrimLimit } from "@/functions/render-helper";
import postInterface from "@/interface/auth/post.interface";
import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/providers/tanstack-query-provider";
import usePostStore from "@/store/post.store";
import { PostAccess } from "@prisma/client";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
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
import ImagePreviewDialog from "../image-preview";
import CommentSkeleton from "../skeleton/comment.skelton";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
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
  setCommentId: (id: string) => void;
  commentLoading: boolean;
  comments: any[];
  hasNextCommentPage: boolean;
  isFetchingNextCommentPage: boolean;
  fetchNextCommentPage: () => void;
  setEditModal: (open: boolean) => void;
  setDeleteModal: (open: boolean) => void;
  changePostAccessType: (post: postInterface) => void;
  handleFollow: (post: postInterface) => void;
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
}: PostCardProps) => {
  const router = useRouter();
  const session = authClient.useSession();
  const { setSelectedPost, setContent } = usePostStore();
  const [commentContent, setCommentContent] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(
    null,
  );
  const [selectedPostImages, setSelectedPostImages] = useState<string[]>([]);

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: () => {
      toast.error("Error occurred while liking/unliking post");
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: () => {
      toast.error("Error occurred while bookmarking/unbookmarking post");
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

  return (
    <div className="relative my-5 w-full flex-1 border-b border-r border-transparent p-4 px-3 before:absolute before:bottom-0 before:right-0 before:h-[1px] before:w-full before:bg-gradient-to-r before:from-transparent before:via-orange-500/30 before:to-transparent after:absolute after:bottom-0 after:right-0 after:h-full after:w-[1px] after:bg-gradient-to-b after:from-transparent  after:to-transparent [&>div]:before:absolute [&>div]:before:left-0 [&>div]:before:top-0 [&>div]:before:h-full [&>div]:before:w-[1px] [&>div]:before:bg-gradient-to-b [&>div]:before:from-transparent  [&>div]:before:to-transparent">
      {/* Orange diagonal glow from bottom-left to top-right */}

      {/* Blue diagonal glow from bottom-right to top-left */}
      {/* <div className="absolute -right-4 size-32 -rotate-45 rounded-full border border-blue-300/50 bg-gradient-to-br from-blue-300/40 via-blue-400/50 to-transparent blur-[150px] backdrop-blur-sm"></div>

      <div className="absolute -bottom-5 left-12 size-32 rotate-45 rounded-full border border-orange-300/50 bg-gradient-to-tl from-orange-300/40 via-orange-400/30 to-transparent blur-[150px] backdrop-blur-sm"></div> */}

      <div className="relative pl-5 backdrop-blur-sm">
        <div className="mr-2 flex w-full items-center justify-between pb-2">
          <div className="flex flex-1 items-center gap-3">
            <Image
              src={post.user.image || "/user.jpg"}
              alt="user"
              className="size-10 cursor-pointer rounded-full shadow-[0_0_3px_rgba(0,122,255,0.5),0_0_5px_rgba(255,165,0,0.5),0_0_7px_rgba(0,122,255,0.4)] transition-all"
              height={200}
              width={200}
              onClick={() => handleUserProfileClick(post.user.id)}
            />

            <div
              onClick={() => handleUserProfileClick(post.user.id)}
              className="cursor-pointer"
            >
              <h1 className="text-sm font-medium">{post.user.name}</h1>
              <h1 className="text-xs text-muted-foreground text-purple-500">
                Nerd@
                <span className="text-white">{post.user.nerdAt}</span>
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {session?.data?.user?.id !== post.user.id && (
              <Button
                variant={"outline"}
                size="sm"
                className={`mx-0 rounded-lg bg-transparent px-2 py-1 text-xs shadow-none hover:bg-transparent md:text-sm`}
                onClick={() => {
                  handleFollow(post);
                }}
              >
                {!post.user?.isFollowingAuthor && <Plus size={15} />}
                {post.user?.isFollowingAuthor ? "Following" : "Follow"}
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger className="mx-auto w-9 py-0 outline-none">
                <MoreHorizontal />
              </DropdownMenuTrigger>
              {session?.data?.user?.id === post.user.id ? (
                <DropdownMenuContent className="mr-5 flex flex-row bg-white dark:bg-textAlternative md:mr-0 md:block">
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedPost(post);
                      setContent(post.content);
                      setEditModal(true);
                    }}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    <span className="hidden md:block">Edit</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => {
                      setSelectedPost(post);
                      setContent(post.content);
                      setDeleteModal(true);
                    }}
                  >
                    <TrashIcon className="mr-2 h-4 w-4" />
                    <span className="hidden md:block">Delete</span>
                  </DropdownMenuItem>
                  {(post?.access as unknown as string) ===
                  (PostAccess.public as unknown as string) ? (
                    <DropdownMenuItem
                      onClick={() => {
                        changePostAccessType(post);
                      }}
                    >
                      <LockIcon className="mr-2 h-4 w-4" />
                      <span className="hidden md:block">Go Private</span>
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem
                      onClick={() => {
                        changePostAccessType(post);
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
                  <DropdownMenuItem
                    onClick={() => handleReport(post.id)}
                    disabled={session?.data?.user?.id === post.user.id}
                  >
                    <BanIcon className="mr-2 h-4 w-4" />
                    <span className="hidden md:block">Report</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              )}
            </DropdownMenu>
          </div>
        </div>

        <div
          className={`mt-2 flex w-full flex-1 ${
            isShortContent && isTooShort ? "flex-col" : "flex-row"
          } items-start justify-center`}
        >
          <div className="flex w-[100%] flex-1 flex-col justify-start gap-5">
            {post?.shared && (
              <Card
                onClick={() => {
                  router.push(`project/${post.project?.id}`);
                }}
                className="overflow-hidden border-gray-100 opacity-80 shadow-none transition-all hover:cursor-pointer hover:opacity-100 dark:border-gray-500/5"
              >
                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="relative h-48 w-full sm:h-auto sm:w-1/3">
                    <Image
                      fill
                      src={post?.project?.image || "/placeholder.svg"}
                      alt={post?.project?.name as string}
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div className="space-y-2">
                      <h3 className="font-medium tracking-tight">
                        {post?.project?.name}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge
                          variant="outline"
                          className="bg-primary/5 text-xs font-normal"
                        >
                          {post?.project?.status}
                        </Badge>
                        {post?.project?.category && (
                          <Badge
                            variant="outline"
                            className="bg-primary/5 text-xs font-normal"
                          >
                            {post?.project?.category}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{post?.project?._count.updates}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5" />
                        <span>{post?.project?._count.stars}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>{post?.project?._count.reviews}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}
            {post.media.length > 0 && (
              <div
                className={`${!post.shared && "mt-4"} grid w-[100%] flex-1 gap-2 ${getGridClass(
                  post.media.length,
                )}`}
              >
                {post.media.length === 1 && (
                  <div
                    className="relative h-[30vh] md:h-[36vh]"
                    onClick={() =>
                      handleMediaClick(
                        0,
                        post.media.map((media) => media.url),
                      )
                    }
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
                  post.media.map((media, mediaIndex) => (
                    <div
                      key={media.id}
                      className="relative h-[20vh] md:h-[28vh]"
                      onClick={() =>
                        handleMediaClick(
                          mediaIndex,
                          post.media.map((media) => media.url),
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
                  ))}
                {post.media.length >= 3 && (
                  <div className="grid h-[36vh] w-[82vw] grid-cols-[auto_120px] gap-2 md:w-[36vw]">
                    <div
                      className="relative h-full w-full"
                      onClick={() =>
                        handleMediaClick(
                          0,
                          post.media.map((media) => media.url),
                        )
                      }
                    >
                      <Image
                        fill
                        src={post.media[0].url}
                        alt="Post media"
                        className="h-full w-full rounded-xl object-cover"
                      />
                    </div>

                    <div className="flex w-full flex-col gap-2">
                      {post.media.slice(1, 4).map((media, mediaIndex) => (
                        <div
                          key={media.id}
                          className="relative h-full w-full"
                          onClick={() =>
                            handleMediaClick(
                              mediaIndex + 1,
                              post.media.map((media) => media.url),
                            )
                          }
                        >
                          <Image
                            fill
                            src={media.url}
                            alt="Post media"
                            className="h-full w-full rounded-xl object-cover"
                          />
                          {mediaIndex === 2 && post.media.length > 4 && (
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
              <h4 className="break-all text-sm md:text-base">
                {expandedStates[index] || !isLongContent
                  ? post.content
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
              isShortContent && isTooShort ? "mt-5 flex-row" : "mt-5 flex-col"
            } gap-5 md:w-16`}
          >
            <div
              className={`rounded-full ${
                isShortContent && isTooShort ? "pr-2" : "px-2"
              } md:mx-auto`}
              onClick={() => handleLike(post.id)}
            >
              {post.likes.some(
                (like) => like.userId === session.data?.user.id,
              ) ? (
                <GoHeartFill className="size-5 text-red-500" />
              ) : (
                <GoHeart className="size-5" />
              )}
            </div>
            <div
              onClick={async () => {
                await setSelectedPost(post);
                toggleCommentShown(post.id);
                await queryClient.invalidateQueries({
                  queryKey: ["comment", post.id],
                });
              }}
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
              onClick={() => handleBookmark(post.id)}
            >
              {post.bookmarks.some(
                (bookmark) => bookmark.userId === session.data?.user.id,
              ) ? (
                <HiBookmark className="size-5 text-primary" />
              ) : (
                <HiOutlineBookmark className="size-5" />
              )}
            </div>
          </div>
        </div>

        {commentShown[post.id] && (
          <div>
            <hr className="mb-2 mt-5" />
            <div className="itemc flex gap-2">
              <input
                placeholder="Comment here"
                className="w-full border-0 border-b border-b-textAlternative/20 bg-transparent text-sm placeholder:font-instrument placeholder:text-lg focus:border-b focus:border-gray-500 focus:outline-none focus:ring-0 dark:border-white/50"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
              />
              <Button
                onClick={handleCommentSubmit}
                className="border bg-transparent shadow-none hover:bg-transparent focus:outline-none focus:ring-0"
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
                modalEditOpened: modalEditOpened,
                modalDeleteOpened: modalDeleteOpened,
                reportModalOpen,
                setReportModalOpen,
                setCommentId,
              })}
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
      </div>
    </div>
  );
};

export default PostCard;
