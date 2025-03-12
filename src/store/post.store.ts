import postInterface from "@/interface/auth/post.interface";
import axios from "axios";
import { create } from "zustand";

interface PostStoreInterface {
  posts: postInterface[];
  selectedPost: postInterface;
  setSelectedPost: (post: postInterface) => void;
}

const usePostStore = create<PostStoreInterface>((set, get) => ({
  posts: [],
  selectedPost: {
    id: "",
    content: "",
    createdAt: null,
    updatedAt: null,
    userId: "",
    user: {
      id: "",
      name: "",
      email: "",
      emailVerified: false,
      image: "",
      createdAt: null,
      updatedAt: null,
      nerdAt: null,
    },
  },
  setSelectedPost: (post: postInterface) => set({ selectedPost: post }),
}));

export default usePostStore;
