import { create } from "zustand";
import postInterface from "@/interface/auth/post.interface";
import PostCommentInterface from "@/interface/auth/comment.interface";
import { SetStateAction } from "react";

interface ExploreStoreInterface {
  // Post states
  selectedPost: postInterface | null;
  setSelectedPost: (post: postInterface) => void;

  // Comment states
  commentShown: { [key: string]: boolean };
  expandedComments: { [key: string]: boolean };
  replyShown: { [key: string]: boolean };
  replyContent: { [key: string]: string };
  expandedReplies: { [key: string]: boolean };

  // Modal states
  editModalOpen: boolean;
  deleteModalOpen: boolean;
  reportModalOpen: boolean;
  editCommentModalOpen: boolean;
  deleteCommentModalOpen: boolean;
  editReplyModalOpen: boolean;
  deleteReplyModalOpen: boolean;

  // Selected items
  selectedComment: PostCommentInterface | null;
  selectedCommentReply: PostCommentInterface | null;
  selectedMediaIndex: number | null;
  selectedPostImages: string[] | null;
  isDialogOpen: boolean;

  // Toggle functions
  toggleCommentShown: (postId: string) => void;
  toggleCommentExpand: (commentId: string) => void;
  toggleReplyShown: (commentId: string) => void;
  toggleReplies: (commentId: string) => void;

  // Setter functions
  setReplyContent: (value: SetStateAction<{ [key: string]: string }>) => void;
  setEditModalOpen: (value: boolean) => void;
  setDeleteModalOpen: (value: boolean) => void;
  setReportModalOpen: (value: boolean) => void;
  setEditCommentModalOpen: (value: boolean) => void;
  setDeleteCommentModalOpen: (value: boolean) => void;
  setEditReplyModalOpen: (value: boolean) => void;
  setDeleteReplyModalOpen: (value: boolean) => void;
  setSelectedComment: (comment: PostCommentInterface | null) => void;
  setSelectedCommentReply: (comment: PostCommentInterface | null) => void;
  setSelectedMediaIndex: (index: number | null) => void;
  setSelectedPostImages: (images: string[] | null) => void;
  setIsDialogOpen: (value: boolean) => void;
}

const useExploreStore = create<ExploreStoreInterface>((set) => ({
  // Initial states
  selectedPost: null,
  commentShown: {},
  expandedComments: {},
  replyShown: {},
  replyContent: {},
  expandedReplies: {},
  editModalOpen: false,
  deleteModalOpen: false,
  reportModalOpen: false,
  editCommentModalOpen: false,
  deleteCommentModalOpen: false,
  editReplyModalOpen: false,
  deleteReplyModalOpen: false,
  selectedComment: null,
  selectedCommentReply: null,
  selectedMediaIndex: null,
  selectedPostImages: null,
  isDialogOpen: false,

  // Toggle functions
  toggleCommentShown: (postId: string) =>
    set((state) => ({
      commentShown: {
        ...state.commentShown,
        [postId]: !state.commentShown[postId],
      },
    })),

  toggleCommentExpand: (commentId: string) =>
    set((state) => ({
      expandedComments: {
        ...state.expandedComments,
        [commentId]: !state.expandedComments[commentId],
      },
    })),

  toggleReplyShown: (commentId: string) =>
    set((state) => ({
      replyShown: {
        ...state.replyShown,
        [commentId]: !state.replyShown[commentId],
      },
    })),

  toggleReplies: (commentId: string) =>
    set((state) => ({
      expandedReplies: {
        ...state.expandedReplies,
        [commentId]: !state.expandedReplies[commentId],
      },
    })),

  // Setter functions
  setSelectedPost: (post) => set({ selectedPost: post }),
  setReplyContent: (value) =>
    set((state) => ({
      replyContent:
        typeof value === "function" ? value(state.replyContent) : value,
    })),
  setEditModalOpen: (value) => set({ editModalOpen: value }),
  setDeleteModalOpen: (value) => set({ deleteModalOpen: value }),
  setReportModalOpen: (value) => set({ reportModalOpen: value }),
  setEditCommentModalOpen: (value) => set({ editCommentModalOpen: value }),
  setDeleteCommentModalOpen: (value) => set({ deleteCommentModalOpen: value }),
  setEditReplyModalOpen: (value) => set({ editReplyModalOpen: value }),
  setDeleteReplyModalOpen: (value) => set({ deleteReplyModalOpen: value }),
  setSelectedComment: (comment) => set({ selectedComment: comment }),
  setSelectedCommentReply: (comment) => set({ selectedCommentReply: comment }),
  setSelectedMediaIndex: (index) => set({ selectedMediaIndex: index }),
  setSelectedPostImages: (images) => set({ selectedPostImages: images }),
  setIsDialogOpen: (value) => set({ isDialogOpen: value }),
}));

export default useExploreStore;
