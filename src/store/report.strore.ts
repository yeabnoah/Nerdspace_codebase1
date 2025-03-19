import { create } from "zustand";

interface reportStore {
  commentId?: string;
  postId?: string;
  reason: string;
  setCommentId: (commentId: string) => void;
  setPostId: (postId: string) => void;
  setReason: (reason: string) => void;
}

const useReportStore = create<reportStore>((set) => ({
  commentId: "",
  postId: "",
  reason: "",

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
}));

export default useReportStore;
