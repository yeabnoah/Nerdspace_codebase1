"use client";

import changePostAccess from "@/functions/access-change-post";
import fetchPosts from "@/functions/fetch-post";
import { getTrimLimit } from "@/functions/render-helper";
import PostCommentInterface from "@/interface/auth/comment.interface";
import postInterface from "@/interface/auth/post.interface";
import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/providers/tanstack-query-provider";
import usePostStore from "@/store/post.store";
import useReportStore from "@/store/report.strore";
import useUserProfileStore from "@/store/userProfile.store";
import { PostAccess } from "@prisma/client";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
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
import { useInView } from "react-intersection-observer";
import ImagePreviewDialog from "../image-preview";
import DeleteModal from "../modal/delete.modal";
import EditModal from "../modal/edit.modal";
import ReportModal from "../modal/report.modal";
import CommentSkeleton from "../skeleton/comment.skelton";
import MorePostsFetchSkeleton from "../skeleton/morepostFetch.skeleton";
import RenderPostSkeleton from "../skeleton/render-post.skeleton";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import DeleteCommentModal from "./comment/DeleteCommentModal";
import EditCommentModal from "./comment/EditCommentModal";
import { renderComments } from "./comment/render-comments";
// import { useRouter } from "next/n";

const RenderPost = () => {
  const { ref, inView } = useInView();
  const session = authClient.useSession();
  const [editModal, setEditModal] = useState(false);
  const { selectedPost, setSelectedPost, content, setContent } = usePostStore();
  const [editPostInput, setEditPostInput] = useState<String>();
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const { setUserProfile } = useUserProfileStore();
  const router = useRouter();
  const [commentShown, setCommentShown] = useState<{ [key: string]: boolean }>(
    {},
  );
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

  const toggleCommentShown = (postId: string) => {
    setCommentShown((prev) => ({
      ...prev,
      [postId]: !prev[postId],
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

  const [commentCursor, setCommentCursor] = useState<string | null>(null);

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

  const {
    data: commentData,
    isLoading: commentLoading,
    fetchNextPage: fetchNextCommentPage,
    hasNextPage: hasNextCommentPage,
    isFetchingNextPage: isFetchingNextCommentPage,
  } = useInfiniteQuery({
    queryKey: ["comment", selectedPost?.id],
    queryFn: async ({ pageParam = null }) => {
      const response = await axios.get(
        `/api/post/comment?postId=${selectedPost?.id}&cursor=${pageParam}`,
      );

      return response.data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: null,
    enabled: !!selectedPost?.id,
  });

  const comments = commentData?.pages.flatMap((page) => page.data) || [];

  const mutation = useMutation({
    mutationKey: ["change-post-status"],
    mutationFn: changePostAccess,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["Privateposts"] });
    },
    onError: () => {
      toast.error("error occured while updating post");
    },
  });

  const followMutation = useMutation({
    mutationKey: ["follow-user", selectedPost?.user.id],
    mutationFn: async () => {
      const response = await axios.post(
        `/api/user/follow?userId=${selectedPost?.user.id}`,
      );
      return response.data.message;
    },
    onSuccess: (message) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(message);
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

  const [editCommentModal, setEditCommentModal] = useState(false);
  const [deleteCommentModal, setDeleteCommentModal] = useState(false);
  const [selectedComment, setSelectedComment] =
    useState<PostCommentInterface | null>(null);

  const handleEditComment = (commentId: string) => {
    const commentser = comments.find((c: any) => c.id === commentId);
    if (commentser) {
      setSelectedComment(commentser);
      setEditCommentModalOpen(true);
    }
  };

  const handleDeleteComment = (commentId: string) => {
    const commentser = comments.find((c: any) => c.id === commentId);
    if (commentser) {
      setSelectedComment(commentser);
      setDeleteCommentModalOpen(true);
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

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCommentReply, setSelectedCommentReply] =
    useState<PostCommentInterface | null>(null);

  const openEditModal = (comment: PostCommentInterface) => {
    setSelectedComment(comment);
    setEditModalOpen(true);
  };

  const openDeleteModal = (comment: PostCommentInterface) => {
    setSelectedComment(comment);
    setDeleteModalOpen(true);
  };

  const [editCommentModalOpen, setEditCommentModalOpen] = useState(false);
  const [deleteCommentModalOpen, setDeleteCommentModalOpen] = useState(false);
  const [editReplyModalOpen, setEditReplyModalOpen] = useState(false);
  const [deleteReplyModalOpen, setDeleteReplyModalOpen] = useState(false);

  const handleEditReply = (commentId: string) => {
    const replies = comments.find((c: any) => c.id === commentId);
    if (replies) {
      setSelectedCommentReply(replies);
      setEditReplyModalOpen(true);
    }
  };

  const handleDeleteReply = (commentId: string) => {
    const replies = comments.find((c: any) => c.id === commentId);
    if (replies) {
      setSelectedCommentReply(replies);
      setDeleteReplyModalOpen(true);
    }
  };

  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState<{
    [key: string]: boolean;
  }>({});
  // const [reportModalOpen, setReportModalOpen] = useState(false);
  const { setPostId, setCommentId } = useReportStore();

  const handleReport = (postId: string) => {
    setPostId(postId);
    setReportModalOpen(true);
  };

  const likeMutation = useMutation({
    mutationFn: async (postId: string) => {
      const response = await axios.post("/api/post/like", {
        postId,
        userId: session.data?.user.id,
      });

      console.log(response.data);
      return response.data.data;
    },
    onSuccess: (_, postId) => {
      setLikedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
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
    onSuccess: (_, postId) => {
      setBookmarkedPosts((prev) => ({ ...prev, [postId]: !prev[postId] }));
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: () => {
      toast.error("Error occurred while bookmarking/unbookmarking post");
    },
  });

  const handleLike = (postId: string) => {
    likeMutation.mutate(postId);
  };

  const handleBookmark = (postId: string) => {
    bookmarkMutation.mutate(postId);
  };

  const handleFollow = async (post: postInterface) => {
    if (session.data?.user.id === post.user.id) {
      toast.error("You cannot follow yourself");
      return;
    }
    await setSelectedPost(post);
    await followMutation.mutate();
    queryClient.invalidateQueries({ queryKey: ["posts"] });
  };

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

  const handleUserProfileClick = (userId: string) => {
    router.push(`/user-profile/${userId}`);
  };

  return (
    <div>
      {data?.pages
        .flatMap((page) => page.data)
        .map((each: postInterface, index) => {
          const contentWords = each.content.split(" ");
          const trimLimit = getTrimLimit();
          const truncatedContent = contentWords.slice(0, trimLimit).join(" ");
          const isLongContent = contentWords.length > trimLimit;
          const isShortContent = contentWords.length < trimLimit;
          const isTooShort = contentWords.length < 10;

          inView && hasNextPage && fetchNextPage();

          return (
            <div
              className="my-5 w-full flex-1 rounded-xl border border-gray-100 p-4 dark:border-gray-500/5"
              key={index}
            >
              <div className="mr-2 flex w-full items-center justify-between pb-2">
                <div className="flex flex-1 items-center gap-3">
                  <Image
                    src={each.user.image || "/user.jpg"}
                    alt="user"
                    className="size-10 cursor-pointer rounded-full"
                    height={200}
                    width={200}
                    onClick={() => handleUserProfileClick(each.user.id)}
                  />

                  <div
                    onClick={() => handleUserProfileClick(each.user.id)}
                    className="cursor-pointer"
                  >
                    <h1 className="text-sm font-medium">{each.user.name}</h1>
                    <h1 className="text-xs text-muted-foreground">
                      Nerd@{each.user.nerdAt}
                    </h1>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {session?.data?.user?.id !== each.user.id && (
                    <Button
                      variant={"outline"}
                      className={`mx-0 rounded-lg px-3 text-xs shadow-none dark:bg-textAlternative md:text-sm`}
                      onClick={() => {
                        handleFollow(each);
                      }}
                    >
                      {!each.user?.isFollowingAuthor && <Plus size={15} />}
                      {each.user?.isFollowingAuthor ? "Following" : "Follow"}
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger className="mx-auto w-9 py-0 outline-none">
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
                        <DropdownMenuItem
                          onClick={() => handleReport(each.id)}
                          disabled={session?.data?.user?.id === each.user.id}
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
                  {each?.shared && (
                    <Card
                      onClick={() => {
                        router.push(`project/${each.project?.id}`);
                      }}
                      className="overflow-hidden border-gray-100 opacity-80 shadow-none transition-all hover:cursor-pointer hover:opacity-100 dark:border-gray-500/5"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row">
                        <div className="relative h-48 w-full sm:h-auto sm:w-1/3">
                          <Image
                            fill
                            src={each?.project?.image || "/placeholder.svg"}
                            alt={each?.project?.name as string}
                            className="object-cover"
                            sizes="(max-width: 640px) 100vw, 33vw"
                          />
                        </div>
                        <div className="flex flex-1 flex-col justify-between p-4">
                          <div className="space-y-2">
                            <h3 className="font-medium tracking-tight">
                              {each?.project?.name}
                            </h3>
                            <div className="flex flex-wrap gap-2">
                              <Badge
                                variant="outline"
                                className="bg-primary/5 text-xs font-normal"
                              >
                                {each?.project?.status}
                              </Badge>
                              {each?.project?.category && (
                                <Badge
                                  variant="outline"
                                  className="bg-primary/5 text-xs font-normal"
                                >
                                  {each?.project?.category}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              <span>{each?.project?._count.updates}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-3.5 w-3.5" />
                              <span>{each?.project?._count.stars}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-3.5 w-3.5" />
                              <span>{each?.project?._count.reviews}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  )}
                  {each.media.length > 0 && (
                    <div
                      className={`${!each.shared && "mt-4"} grid w-[100%] flex-1 gap-2 ${getGridClass(
                        each.media.length,
                      )}`}
                    >
                      {each.media.length === 1 && (
                        <div
                          className="relative h-[30vh] md:h-[36vh]"
                          onClick={() =>
                            handleMediaClick(
                              0,
                              each.media.map((media) => media.url),
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
                        each.media.map((media, mediaIndex) => (
                          <div
                            key={media.id}
                            className="relative h-[20vh] md:h-[28vh]"
                            onClick={() =>
                              handleMediaClick(
                                mediaIndex,
                                each.media.map((media) => media.url),
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
                      {each.media.length >= 3 && (
                        <div className="grid h-[36vh] w-[82vw] grid-cols-[auto_120px] gap-2 md:w-[36vw]">
                          <div
                            className="relative h-full w-full"
                            onClick={() =>
                              handleMediaClick(
                                0,
                                each.media.map((media) => media.url),
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
                            {each.media.slice(1, 4).map((media, mediaIndex) => (
                              <div
                                key={media.id}
                                className="relative h-full w-full"
                                onClick={() =>
                                  handleMediaClick(
                                    mediaIndex + 1,
                                    each.media.map((media) => media.url),
                                  )
                                }
                              >
                                <Image
                                  fill
                                  src={media.url}
                                  alt="Post media"
                                  className="h-full w-full rounded-xl object-cover"
                                />
                                {mediaIndex === 2 && each.media.length > 4 && (
                                  <div className="absolute bottom-2 right-2 rounded-full bg-black/50 px-2 py-1 text-white">
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
                    onClick={() => handleLike(each.id)}
                  >
                    {each.likes.some(
                      (like) => like.userId === session.data?.user.id,
                    ) ? (
                      <GoHeartFill className="size-5 text-red-500" />
                    ) : (
                      <GoHeart className="size-5" />
                    )}
                  </div>
                  <div
                    onClick={async () => {
                      await setSelectedPost(each);
                      toggleCommentShown(each.id);
                      await queryClient.invalidateQueries({
                        queryKey: ["comment", each.id],
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
                    onClick={() => handleBookmark(each.id)}
                  >
                    {each.bookmarks.some(
                      (bookmark) => bookmark.userId === session.data?.user.id,
                    ) ? (
                      <HiBookmark className="size-5 text-primary" />
                    ) : (
                      <HiOutlineBookmark className="size-5" />
                    )}
                  </div>
                </div>
              </div>

              {commentShown[each.id] && (
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
                      modalEditOpened: editModalOpen,
                      modalDeleteOpened: deleteModalOpen,
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
            </div>
          );
        })}
      <div ref={ref}>{isFetchingNextPage && <MorePostsFetchSkeleton />}</div>

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

      {selectedComment && (
        <>
          <EditCommentModal
            commentId={selectedComment.id}
            postId={selectedPost.id} // Pass postId here
            initialContent={selectedComment.content}
            isOpen={editCommentModalOpen}
            onClose={() => setEditCommentModalOpen(false)}
          />
          <DeleteCommentModal
            commentId={selectedComment.id}
            isOpen={deleteCommentModalOpen}
            onClose={() => setDeleteCommentModalOpen(false)}
          />
        </>
      )}
      {selectedCommentReply && (
        <>
          <EditCommentModal
            postId={selectedPost.id}
            commentId={selectedCommentReply.id}
            initialContent={selectedCommentReply.content}
            isOpen={editReplyModalOpen}
            onClose={() => setEditReplyModalOpen(false)}
          />
          <DeleteCommentModal
            commentId={selectedCommentReply.id}
            isOpen={deleteReplyModalOpen}
            onClose={() => setDeleteReplyModalOpen(false)}
          />
        </>
      )}
      <ReportModal
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />
    </div>
  );
};

export default RenderPost;
