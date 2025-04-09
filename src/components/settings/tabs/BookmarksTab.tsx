"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import PostCard from "@/components/post/post-card";
import { toast } from "react-hot-toast";
import postInterface from "@/interface/auth/post.interface";

interface BookmarksResponse {
  data: postInterface[];
  pagination: {
    nextCursor: string | null;
    hasNextPage: boolean;
    total: number;
  };
}

export default function BookmarksTab() {
  const [posts, setPosts] = useState<postInterface[]>([]);
  const [expandedStates, setExpandedStates] = useState<boolean[]>([]);
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
  const [expandedReplies, setExpandedReplies] = useState<{
    [key: string]: boolean;
  }>({});
  const [modalEditOpened, setModalEditOpened] = useState(false);
  const [modalDeleteOpened, setModalDeleteOpened] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [commentId, setCommentId] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [hasNextCommentPage, setHasNextCommentPage] = useState(false);
  const [isFetchingNextCommentPage, setIsFetchingNextCommentPage] =
    useState(false);
  const [selectedCommentReply, setSelectedCommentReply] = useState<any>(null);

  const { ref, inView } = useInView();

  const { data, isLoading, isError, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: ["bookmarks"],
      queryFn: async ({ pageParam }: { pageParam: string | null }) => {
        const response = await axios.get<BookmarksResponse>(
          `/api/users/bookmarks?cursor=${pageParam || ""}&limit=10`,
        );
        return response.data;
      },
      getNextPageParam: (lastPage) => lastPage.pagination.nextCursor,
      initialPageParam: null as string | null,
    });

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  useEffect(() => {
    if (data) {
      const newPosts = data.pages.flatMap(
        (page: BookmarksResponse) => page.data,
      );
      setPosts(newPosts);
      setExpandedStates(new Array(newPosts.length).fill(false));
    }
  }, [data]);

  const toggleExpand = (index: number) => {
    setExpandedStates((prev) => {
      const newStates = [...prev];
      newStates[index] = !newStates[index];
      return newStates;
    });
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
    // Implement reply submission logic
  };

  const toggleReplies = (commentId: string) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleEditComment = (commentId: string) => {
    // Implement edit comment logic
  };

  const handleDeleteComment = (commentId: string) => {
    // Implement delete comment logic
  };

  const openEditModal = (comment: any) => {
    setSelectedCommentReply(comment);
    setModalEditOpened(true);
  };

  const openDeleteModal = (comment: any) => {
    setSelectedCommentReply(comment);
    setModalDeleteOpened(true);
  };

  const fetchNextCommentPage = () => {
    // Implement fetch next comment page logic
  };

  const changePostAccessType = (post: postInterface) => {
    // Implement change post access type logic
  };

  const handleFollow = (post: postInterface) => {
    // Implement follow logic
  };

  const handleLike = (postId: string) => {
    // Implement like logic
  };

  const handleBookmark = (postId: string) => {
    // Implement bookmark logic
  };

  if (isError) {
    toast.error("Failed to load bookmarks");
    return <div>Error loading bookmarks</div>;
  }

  if (isLoading && posts.length === 0) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="rounded-lg border p-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
            </div>
            <Skeleton className="mt-4 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex h-40 items-center justify-center">
        <p className="text-muted-foreground">No bookmarked posts yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {posts.map((post, index) => (
        <PostCard
          key={post.id}
          post={post}
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
          modalEditOpened={modalEditOpened}
          modalDeleteOpened={modalDeleteOpened}
          reportModalOpen={reportModalOpen}
          setReportModalOpen={setReportModalOpen}
          setCommentId={setCommentId}
          commentLoading={commentLoading}
          comments={comments}
          hasNextCommentPage={hasNextCommentPage}
          isFetchingNextCommentPage={isFetchingNextCommentPage}
          fetchNextCommentPage={fetchNextCommentPage}
          setEditModal={setModalEditOpened}
          setDeleteModal={setModalDeleteOpened}
          changePostAccessType={changePostAccessType}
          handleFollow={handleFollow}
          handleLike={handleLike}
          handleBookmark={handleBookmark}
        />
      ))}
      {hasNextPage && (
        <div ref={ref} className="flex justify-center py-4">
          <Skeleton className="h-4 w-1/4" />
        </div>
      )}
    </div>
  );
}
