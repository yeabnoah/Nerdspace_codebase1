import postInterface from "@/interface/auth/post.interface";
import { create } from "zustand";

interface PostStoreInterface {
  posts: postInterface[];
  selectedPost: postInterface | null;
  setSelectedPost: (post: postInterface) => void;
  content: string;
  setContent: (content: string) => void;
}

const usePostStore = create<PostStoreInterface>((set) => ({
  posts: [],
  selectedPost: null,
  setSelectedPost: (post: postInterface) =>
    set({
      selectedPost: post,
      content: post.content,
    }),
  content: "",
  setContent: (content: string) =>
    set({
      content,
    }),
}));

export default usePostStore;
