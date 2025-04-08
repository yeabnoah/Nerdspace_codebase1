"use client";

import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/providers/tanstack-query-provider";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useParams } from "next/navigation";
import PostCard from "@/components/post/PostCard";
import { useState } from "react";

const PostDetailPage = () => {
  const params = useParams();
  const postId = params.id as string;
  const session = authClient.useSession();
  const [expandedStates, setExpandedStates] = useState<boolean[]>([]);
  const [commentShown, setCommentShown] = useState<{ [key: string]: boolean }>({});
  const [expandedComments, setExpandedComments] = useState<{ [key: string]: boolean }>({});
  const [replyShown, setReplyShown] = useState<{ [key: string]: boolean }>({});
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});
  const [expandedReplies, setExpandedReplies] = useState<{ [key: string]: boolean }>({});
  const [modalEditOpened, setModalEditOpened] = useState(false);
  const [modalDeleteOpened, setModalDeleteOpened] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [commentId, setCommentId] = useState("");

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", postId],
    queryFn: async () => {
      const response = await axios.get(`/api/post/${postId}`);
      return response.data;
    },
    enabled: !!postId,
  });

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

  const handleEditComment = (commentId: string) => {
    // Implement comment edit logic
  };

  const handleDeleteComment = (commentId: string) => {
    // Implement comment delete logic
  };

  const openEditModal = (comment: any) => {
    // Implement edit modal logic
  };

  const openDeleteModal = (comment: any) => {
    // Implement delete modal logic
  };

  const setSelectedCommentReply = (comment: any) => {
    // Implement selected comment reply logic
  };

  const changePostAccessType = (post: any) => {
    // Implement post access type change logic
  };

  const handleFollow = (post: any) => {
    // Implement follow logic
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!post) {
    return <div>Post not found</div>;
  }

  return (
    <div className="container mx-auto max-w-3xl py-8">
      <PostCard
        post={post}
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
        toggleReplies={toggleCommentExpand}
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
        commentLoading={false}
        comments={[]}
        hasNextCommentPage={false}
        isFetchingNextCommentPage={false}
        fetchNextCommentPage={() => {}}
        setEditModal={setModalEditOpened}
        setDeleteModal={setModalDeleteOpened}
        changePostAccessType={changePostAccessType}
        handleFollow={handleFollow}
      />
    </div>
  );
};

export default PostDetailPage; 