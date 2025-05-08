"use client";

import changePostAccess from "@/functions/access-change-post";
import fetchPosts from "@/functions/fetch-post";
import PostCommentInterface from "@/interface/auth/comment.interface";
import postInterface from "@/interface/auth/post.interface";
import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/providers/tanstack-query-provider";
import usePostStore from "@/store/post.store";
import useReportStore from "@/store/report.strore";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useInView } from "react-intersection-observer";
import ImagePreviewDialog from "../image-preview";
import ReportModal from "../modal/report.modal";
import MorePostsFetchSkeleton from "../skeleton/morepostFetch.skeleton";
import RenderPostSkeleton from "../skeleton/render-post.skeleton";
import DeleteCommentModal from "./comment/DeleteCommentModal";
import EditCommentModal from "./comment/EditCommentModal";
import { postAccess } from "@/interface/auth/post.interface";
import PostCard from "./post-card";

const RenderPost = () => {
  const { ref, inView } = useInView();
  const session = authClient.useSession();
  const { selectedPost, setSelectedPost } = usePostStore();
  const [reportModalOpen, setReportModalOpen] = useState(false);
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
  // const [commentContent, setCommentContent] = useState<string>("");

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
    setCommentShown((prev) => {
      const newCommentShown = Object.keys(prev).reduce(
        (acc, key) => {
          acc[key] = false;
          return acc;
        },
        {} as { [key: string]: boolean },
      );

      newCommentShown[postId] = !prev[postId];

      return newCommentShown;
    });
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

  // const followMutation = useMutation({
  //   mutationKey: ["follow-user", selectedPost?.user.id],
  //   mutationFn: async () => {
  //     const response = await axios.post(
  //       `/api/user/follow?userId=${selectedPost?.user.id}`,
  //     );
  //     return response.data.message;
  //   },
  //   onSuccess: (message) => {
  //     queryClient.invalidateQueries({ queryKey: ["posts"] });
  //     queryClient.invalidateQueries({ queryKey: ["users"] });
  //     toast.success(message);
  //   },
  // });

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
        postId: selectedPost?.id as string,
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

  // const commentMutation = useMutation({
  //   mutationKey: ["add-comment"],
  //   mutationFn: async ({
  //     postId,
  //     content,
  //   }: {
  //     postId: string;
  //     content: string;
  //   }) => {
  //     const response = await axios.post("/api/post/comment", {
  //       postId,
  //       content,
  //     });
  //     return response.data;
  //   },
  //   onSuccess: () => {
  //     queryClient.invalidateQueries({ queryKey: ["comment"] });
  //     setCommentContent("");
  //   },
  //   onError: () => {
  //     toast.error("Error occurred while adding comment");
  //   },
  // });

  const handleReplySubmit = (commentId: string) => {
    if (replyContent[commentId]) {
      replyMutation.mutate({ commentId, content: replyContent[commentId] });
      setReplyContent((prev) => ({ ...prev, [commentId]: "" }));
    }
  };

  const [selectedComment, setSelectedComment] =
    useState<PostCommentInterface | null>(null);

  const handleEditComment = (commentId: string) => {
    const commentFound = comments.find(
      (c: PostCommentInterface) => c.id === commentId,
    );
    if (commentFound) {
      setSelectedComment(commentFound);
      setEditCommentModalOpen(true);
    }
  };

  const handleDeleteComment = (commentId: string) => {
    const commentFound = comments.find(
      (c: PostCommentInterface) => c.id === commentId,
    );
    if (commentFound) {
      setSelectedComment(commentFound);
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

  const [editCommentModalOpen, setEditCommentModalOpen] = useState(false);
  const [deleteCommentModalOpen, setDeleteCommentModalOpen] = useState(false);
  const [editReplyModalOpen, setEditReplyModalOpen] = useState(false);
  const [deleteReplyModalOpen, setDeleteReplyModalOpen] = useState(false);

  const { setPostId, setCommentId } = useReportStore();
  console.log(setPostId);

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

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMediaIndex] = useState<number | null>(null);
  const [selectedPostImages] = useState<string[]>([]);
  const [likedPosts, setLikedPosts] = useState<{ [key: string]: boolean }>({});
  const [bookmarkedPosts, setBookmarkedPosts] = useState<{
    [key: string]: boolean;
  }>({});

  // console.log(likedPosts, bookmarkedPosts);

  const changePostAccessType = async (currentPost: postInterface) => {
    setSelectedPost(currentPost);
    await mutation.mutate();
  };

  if (isLoading) {
    return <RenderPostSkeleton />;
  }

  if (data && data.pages.flatMap((page) => page.data).length === 0) {
    return (
      <div className="flex justify-center items-center w-full h-[50vh]">
        No posts available
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center w-full h-[60vh]">
        Error loading posts
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="z-10 relative px-4 md:px-0">
        {data?.pages
          .flatMap((page) => page.data)
          .map((each: postInterface, index) => {
            if (inView && hasNextPage) {
              fetchNextPage();
            }

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
                setCommentId={setCommentId}
                openEditModal={() => setEditModalOpen(true)}
                openDeleteModal={() => setDeleteModalOpen(true)}
                setSelectedCommentReply={setSelectedCommentReply}
                modalEditOpened={editModalOpen}
                modalDeleteOpened={deleteModalOpen}
                reportModalOpen={reportModalOpen}
                setReportModalOpen={setReportModalOpen}
                commentLoading={commentLoading}
                comments={comments}
                hasNextCommentPage={hasNextCommentPage}
                isFetchingNextCommentPage={isFetchingNextCommentPage}
                fetchNextCommentPage={fetchNextCommentPage}
                setEditModal={setEditModalOpen}
                setDeleteModal={setDeleteModalOpen}
                changePostAccessType={changePostAccessType}
                handleLike={handleLike}
                handleBookmark={handleBookmark}
              />
            );
          })}
        <div ref={ref}>{isFetchingNextPage && <MorePostsFetchSkeleton />}</div>
      </div>

      <ImagePreviewDialog
        images={selectedPostImages}
        initialIndex={selectedMediaIndex || 0}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />

      {selectedComment && (
        <>
          <EditCommentModal
            commentId={selectedComment.id}
            postId={selectedPost?.id as string}
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
            postId={selectedPost?.id as string}
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
