import { create } from "zustand";

interface reportStore {
  commentId?: string;
  postId?: string;
  reason: string;
  additionalContext: string;
  setCommentId: (commentId: string) => void;
  setPostId: (postId: string) => void;
  setReason: (reason: string) => void;
  setAdditionalContext: (context: string) => void;
}

const useReportStore = create<reportStore>((set) => ({
  commentId: "",
  postId: "",
  reason: "",
  additionalContext: "",

  setCommentId: (commentId: string) => {
    set({
      commentId: commentId,
    });
  },

  setPostId: (postId: string) => {
    set({
      postId: postId,
    });
  },

  setReason: (reason: string) => {
    set({
      reason: reason,
    });
  },

  setAdditionalContext: (context: string) => {
    set({
      additionalContext: context,
    });
  },
}));

export default useReportStore;
