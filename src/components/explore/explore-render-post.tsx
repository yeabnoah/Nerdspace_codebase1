"use client";

import fetchPosts from "@/functions/fetch-post";
import postInterface from "@/interface/auth/post.interface";
import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/providers/tanstack-query-provider";
import useExploreStore from "@/store/explore.store";
import usePostStore from "@/store/post.store";
import useReportStore from "@/store/report.strore";
import { postAccess } from "@/interface/auth/post.interface";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useInView } from "react-intersection-observer";
import ImagePreviewDialog from "../image-preview";
import DeleteModal from "../modal/delete.modal";
import EditModal from "../modal/edit.modal";
import ReportModal from "../modal/report.modal";
import DeleteCommentModal from "../post/comment/DeleteCommentModal";
import EditCommentModal from "../post/comment/EditCommentModal";
import PostCard from "../post/post-card";
import MorePostsFetchSkeleton from "../skeleton/morepostFetch.skeleton";
import RenderPostSkeleton from "../skeleton/render-post.skeleton";

interface ExploreRenderPostProps {
  selectedPost: postInterface;
}

interface Like {
  id: string;
  postId: string;
  userId: string;
}

interface Bookmark {
  id: string;
  postId: string;
  userId: string;
}

const ExploreRenderPost = ({ selectedPost }: ExploreRenderPostProps) => {
  const { ref, inView } = useInView();
  const session = authClient.useSession();
  const { setContent } = usePostStore();
  const { setPostId, setCommentId } = useReportStore();
  const [post, setPost] = useState(selectedPost);

  // Update post state when selectedPost changes
  React.useEffect(() => {
    setPost(selectedPost);
  }, [selectedPost]);

  // Ensure post data is properly structured
  const currentPost = {
    ...post,
    bookmarks: post?.bookmarks || [],
    likes: post?.likes || [],
    media: post?.media || [],
  };

  // Get all state and functions from explore store
  const {
    commentShown,
    expandedComments,
    replyShown,
    replyContent,
    expandedReplies,
    editModalOpen,
    deleteModalOpen,
    reportModalOpen,
    editCommentModalOpen,
    deleteCommentModalOpen,
    editReplyModalOpen,
    deleteReplyModalOpen,
    selectedComment,
    selectedCommentReply,
    selectedMediaIndex,
    selectedPostImages,
    isDialogOpen,
    toggleCommentShown,
    toggleCommentExpand,
    toggleReplyShown,
    toggleReplies,
    setReplyContent,
    setEditModalOpen,
    setDeleteModalOpen,
    setReportModalOpen,
    setEditCommentModalOpen,
    setDeleteCommentModalOpen,
    setEditReplyModalOpen,
    setDeleteReplyModalOpen,
    setSelectedComment,
    setSelectedCommentReply,
    setIsDialogOpen,
  } = useExploreStore();

  const [expandedStates, setExpandedStates] = useState<boolean[]>([]);

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
    queryKey: ["comment", currentPost?.id],
    queryFn: async ({ pageParam = null }) => {
      const response = await axios.get(
        `/api/post/comment?postId=${currentPost?.id}&cursor=${pageParam}`,
      );
      return response.data;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: null,
    enabled: !!currentPost?.id,
  });

  const comments = commentData?.pages.flatMap((page) => page.data) || [];

  const handleReplySubmit = (commentId: string) => {
    if (replyContent[commentId]) {
      axios
        .post("/api/post/comment", {
          postId: currentPost.id,
          content: replyContent[commentId],
          parentId: commentId,
        })
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["comment"] });
          setReplyContent({ [commentId]: "" });
        })
        .catch(() => {
          toast.error("Error occurred while adding reply");
        });
    }
  };

  const handleEditComment = (commentId: string) => {
    const comment = comments.find((c) => c.id === commentId);
    if (comment) {
      setSelectedComment(comment);
      setEditCommentModalOpen(true);
    }
  };

  const handleDeleteComment = (commentId: string) => {
    const comment = comments.find((c) => c.id === commentId);
    if (comment) {
      setSelectedComment(comment);
      setDeleteCommentModalOpen(true);
    }
  };

  const likeMutation = useMutation({
    mutationFn: async (postId: string) => {
      const response = await axios.post("/api/post/like", {
        postId,
        userId: session.data?.user.id,
      });
      return response.data.data;
    },
    onMutate: async (postId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      // Snapshot the previous value
      const previousPosts = queryClient.getQueryData(["posts"]);

      // Update the selected post optimistically
      if (currentPost.id === postId) {
        const isLiked = currentPost.likes.some(
          (like: Like) => like.userId === session.data?.user.id,
        );
        setPost((prev) => ({
          ...prev!,
          likes: isLiked
            ? prev!.likes.filter(
                (like: Like) => like.userId !== session.data?.user.id,
              )
            : [
                ...prev!.likes,
                {
                  id: Date.now().toString(),
                  postId,
                  userId: session.data?.user.id || "",
                },
              ],
        }));
      }

      // Optimistically update the feed posts
      queryClient.setQueryData(["posts"], (old: unknown) => {
        if (!old || typeof old !== "object") return old;
        const typedOld = old as { pages: { data: postInterface[] }[] };
        return {
          ...typedOld,
          pages: typedOld.pages.map((page) => ({
            ...page,
            data: page.data.map((post) => {
              if (post.id === postId) {
                const isLiked = post.likes.some(
                  (like: Like) => like.userId === session.data?.user.id,
                );
                return {
                  ...post,
                  likes: isLiked
                    ? post.likes.filter(
                        (like: Like) => like.userId !== session.data?.user.id,
                      )
                    : [
                        ...post.likes,
                        {
                          id: Date.now().toString(),
                          postId,
                          userId: session.data?.user.id || "",
                        },
                      ],
                };
              }
              return post;
            }),
          })),
        };
      });

      return { previousPosts };
    },
    onError: (_err, postId, context) => {
      // Revert back to the previous value on error
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
      toast.error("Error occurred while liking/unliking post");
    },
    onSettled: () => {
      // Refetch to ensure data is in sync
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
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["posts"] });

      // Snapshot the previous value
      const previousPosts = queryClient.getQueryData(["posts"]);

      // Update the selected post optimistically
      if (currentPost.id === postId) {
        const isBookmarked = currentPost.bookmarks.some(
          (bookmark: Bookmark) => bookmark.userId === session.data?.user.id,
        );
        setPost((prev) => ({
          ...prev!,
          bookmarks: isBookmarked
            ? prev!.bookmarks.filter(
                (bookmark: Bookmark) =>
                  bookmark.userId !== session.data?.user.id,
              )
            : [
                ...prev!.bookmarks,
                {
                  id: Date.now().toString(),
                  postId,
                  userId: session.data?.user.id || "",
                },
              ],
        }));
      }

      // Optimistically update the feed posts
      queryClient.setQueryData(["posts"], (old: unknown) => {
        if (!old || typeof old !== "object") return old;
        const typedOld = old as { pages: { data: postInterface[] }[] };
        return {
          ...typedOld,
          pages: typedOld.pages.map((page) => ({
            ...page,
            data: page.data.map((post) => {
              if (post.id === postId) {
                const isBookmarked = post.bookmarks.some(
                  (bookmark: Bookmark) =>
                    bookmark.userId === session.data?.user.id,
                );
                return {
                  ...post,
                  bookmarks: isBookmarked
                    ? post.bookmarks.filter(
                        (bookmark: Bookmark) =>
                          bookmark.userId !== session.data?.user.id,
                      )
                    : [
                        ...post.bookmarks,
                        {
                          id: Date.now().toString(),
                          postId,
                          userId: session.data?.user.id || "",
                        },
                      ],
                };
              }
              return post;
            }),
          })),
        };
      });

      return { previousPosts };
    },
    onError: (_err, postId, context) => {
      // Revert back to the previous value on error
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
      toast.error("Error occurred while bookmarking/unbookmarking post");
    },
    onSettled: () => {
      // Refetch to ensure data is in sync
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleLike = (postId: string) => {
    likeMutation.mutate(postId);
  };

  const handleBookmark = (postId: string) => {
    bookmarkMutation.mutate(postId);
  };

  const changePostAccessType = async (post: postInterface) => {
    try {
      const newAccess =
        post.access.toString() === "public"
          ? postAccess.private
          : postAccess.public;
      await axios.patch("/api/security", {
        id: post.id,
        access: newAccess,
      });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post access updated successfully");
    } catch (_error) {
      toast.error("Error updating post access");
    }
  };

  const handleFollow = async (post: postInterface) => {
    try {
      await axios.post("/api/user/follow", { userId: post.user.id });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("User followed successfully");
    } catch (_error) {
      toast.error("Error following user");
    }
  };

  const toggleExpand = (index: number) => {
    setExpandedStates((prev) => {
      const newExpandedStates = [...prev];
      newExpandedStates[index] = !newExpandedStates[index];
      return newExpandedStates;
    });
  };

  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <RenderPostSkeleton />
        <div className="space-y-4">
          <RenderPostSkeleton />
          <RenderPostSkeleton />
          <RenderPostSkeleton />
        </div>
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

  const allPosts = data?.pages.flatMap((page) => page.data) || [];
  const feedPosts = allPosts.filter((post) => post.id !== currentPost.id);

  return (
    <div className="relative">
      <div className="z-10 relative">
        {/* Render selected post first */}
        <PostCard
          key="selected-post"
          post={currentPost}
          index={0}
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
          openEditModal={() => setEditModalOpen(true)}
          openDeleteModal={() => setDeleteModalOpen(true)}
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
          setEditModal={setEditModalOpen}
          setDeleteModal={setDeleteModalOpen}
          changePostAccessType={changePostAccessType}
          handleLike={handleLike}
          handleBookmark={handleBookmark}
        />

        {/* Render the rest of the feed */}
        {feedPosts.length > 0 && (
          <div className="space-y-4 mt-8">
            {feedPosts.map((post, index) => (
              <PostCard
                key={post.id}
                post={post}
                index={index + 1}
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
                openEditModal={() => setEditModalOpen(true)}
                openDeleteModal={() => setDeleteModalOpen(true)}
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
                setEditModal={setEditModalOpen}
                setDeleteModal={setDeleteModalOpen}
                changePostAccessType={changePostAccessType}
                handleLike={handleLike}
                handleBookmark={handleBookmark}
              />
            ))}
          </div>
        )}

        <div ref={ref}>{isFetchingNextPage && <MorePostsFetchSkeleton />}</div>

        <ImagePreviewDialog
          images={selectedPostImages || []}
          initialIndex={selectedMediaIndex || 0}
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
        />

        <EditModal
          incasePost={currentPost}
          setEditModal={setEditModalOpen}
          editModal={editModalOpen}
          incaseContent={currentPost.content}
        />

        <DeleteModal
          selectedPost={currentPost}
          setDeleteModal={setDeleteModalOpen}
          deleteModal={deleteModalOpen}
          content={currentPost.content}
          setContent={setContent}
        />

        {selectedComment && (
          <>
            <EditCommentModal
              commentId={selectedComment.id}
              postId={currentPost.id}
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
              postId={currentPost.id}
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
    </div>
  );
};

export default ExploreRenderPost;
