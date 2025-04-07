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
import PostCard from "./post-card";

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
            <PostCard
              key={index}
              post={each}
              index={index}
              expandedStates={expandedStates}
              toggleExpand={toggleExpand}
              commentShown={commentShown}
              toggleCommentShown={toggleCommentShown}
              expandedComments={expandedComments}
              toggleCommentExpand={toggleCommentExpand}
              replyShown={replyShown}
              toggleReplyShown={toggleReplyShown}
              replyContent={replyContent}
              setReplyContent={setReplyContent}
              handleReplySubmit={handleReplySubmit}
              expandedReplies={expandedReplies}
              toggleReplies={toggleReplies}
              handleEditComment={handleEditComment}
              handleDeleteComment={handleDeleteComment}
              openEditModal={openEditModal}
              openDeleteModal={openDeleteModal}
              setSelectedCommentReply={setSelectedCommentReply}
              modalEditOpened={editModalOpen}
              modalDeleteOpened={deleteModalOpen}
              reportModalOpen={reportModalOpen}
              setReportModalOpen={setReportModalOpen}
              setCommentId={setCommentId}
              commentLoading={commentLoading}
              comments={comments}
              hasNextCommentPage={hasNextCommentPage}
              isFetchingNextCommentPage={isFetchingNextCommentPage}
              fetchNextCommentPage={fetchNextCommentPage}
              setEditModal={setEditModal}
              setDeleteModal={setDeleteModal}
              changePostAccessType={changePostAccessType}
              handleFollow={handleFollow}
            />
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
            postId={selectedPost.id}
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
