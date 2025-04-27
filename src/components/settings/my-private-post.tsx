"use client";

import changePostAccess from "@/functions/access-change-post";
import fetchMyPrivatePosts from "@/functions/fetch-my-private-post";
import { getTrimLimit } from "@/functions/render-helper";
import postInterface from "@/interface/auth/post.interface";
import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/providers/tanstack-query-provider";
import usePostStore from "@/store/post.store";
import { PostAccess } from "@prisma/client";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { useInfiniteQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  BanIcon,
  Edit,
  LockIcon,
  LockOpen,
  MessageCircle,
  MoreHorizontal,
  Share2Icon,
  TrashIcon
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import toast from "react-hot-toast";
import { GoHeart } from "react-icons/go";
import { HiOutlineBookmark } from "react-icons/hi2";
import { useInView } from "react-intersection-observer";
import ImagePreviewDialog from "../image-preview";
import DeleteModal from "../modal/delete.modal";
import EditModal from "../modal/edit.modal";
import RenderPostSkeleton from "../skeleton/render-post.skeleton";
import { Card } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../ui/dropdown-menu";
import { Skeleton } from "../ui/skeleton";
import PostCard from "../post/post-card";

const iconVariants = {
  initial: { scale: 1 },
  hover: { scale: 1.2 },
  tap: { scale: 0.9 },
};

const RenderMyPrivatePost = () => {
  const { ref, inView } = useInView();
  const session = authClient.useSession();
  const [editModal, setEditModal] = useState(false);
  const { selectedPost, setSelectedPost, content, setContent } = usePostStore();
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(
    null,
  );
  const [selectedPostImages, setSelectedPostImages] = useState<string[]>([]);
  const [expandedStates, setExpandedStates] = useState<boolean[]>([]);
  const [commentShown, setCommentShown] = useState<{ [key: string]: boolean }>({});
  const [expandedComments, setExpandedComments] = useState<{ [key: string]: boolean }>({});
  const [replyShown, setReplyShown] = useState<{ [key: string]: boolean }>({});
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});
  const [expandedReplies, setExpandedReplies] = useState<{ [key: string]: boolean }>({});
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [commentId, setCommentId] = useState("");

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

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["Privateposts"],
    queryFn: fetchMyPrivatePosts,
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const mutation = useMutation({
    mutationKey: ["change-post-status-private"],
    mutationFn: changePostAccess,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
      queryClient.invalidateQueries({ queryKey: ["my-private-posts"] });
      queryClient.invalidateQueries({ queryKey: ["Privateposts"] });
    },
    onError: () => {
      toast.error("error occured while updating post");
    },
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
    // Implement reply submit logic
    console.log("Reply submitted for comment:", commentId);
  };

  const toggleReplies = (commentId: string) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleEditComment = (commentId: string) => {
    // Implement edit comment logic
    console.log("Edit comment:", commentId);
  };

  const handleDeleteComment = (commentId: string) => {
    // Implement delete comment logic
    console.log("Delete comment:", commentId);
  };

  const changePostAccessType = async (currentPost: postInterface) => {
    setSelectedPost(currentPost);
    await mutation.mutate();
  };

  const handleLike = (postId: string) => {
    // Implement like logic
    console.log("Like post:", postId);
  };

  const handleBookmark = (postId: string) => {
    // Implement bookmark logic
    console.log("Bookmark post:", postId);
  };

  if (isLoading) {
    return <RenderPostSkeleton />;
  }

  if (data && data.pages.flatMap((page) => page.data).length === 0) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        No private posts available
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

  return (
    <div className="w-full max-w-3xl mx-auto">
      {data?.pages
        .flatMap((page) => page.data)
        .map((post, index) => (
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
            openEditModal={() => {
              setSelectedPost(post);
              setEditModal(true);
            }}
            openDeleteModal={() => {
              setSelectedPost(post);
              setDeleteModal(true);
            }}
            setSelectedCommentReply={() => {}}
            modalEditOpened={editModal}
            modalDeleteOpened={deleteModal}
            reportModalOpen={reportModalOpen}
            setReportModalOpen={setReportModalOpen}
            commentLoading={false}
            comments={[]}
            hasNextCommentPage={false}
            isFetchingNextCommentPage={false}
            fetchNextCommentPage={() => {}}
            setEditModal={setEditModal}
            setDeleteModal={setDeleteModal}
            changePostAccessType={changePostAccessType}
            handleLike={handleLike}
            handleBookmark={handleBookmark}
            setCommentId={setCommentId}
          />
        ))}

      <div ref={ref}>
        {isFetchingNextPage && <RenderPostSkeleton />}
      </div>

      <ImagePreviewDialog
        images={selectedPostImages}
        initialIndex={selectedMediaIndex || 0}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />

      <EditModal
        incasePost={selectedPost as postInterface}
        setEditModal={setEditModal}
        editModal={editModal}
        incaseContent={content}
      />

      <DeleteModal
        selectedPost={selectedPost as postInterface}
        setDeleteModal={setDeleteModal}
        deleteModal={deleteModal}
        content={content}
        setContent={setContent}
      />
    </div>
  );
};

export default RenderMyPrivatePost;
