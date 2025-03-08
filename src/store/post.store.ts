import postInterface from "@/interface/auth/post.interface";
import { create } from "zustand";
import axios from "axios";

interface PostStoreInterface {
  posts: postInterface[];
  setPosts: (posts: postInterface[]) => void;
  fetchPosts: () => void;
  fetchPostLoading: boolean;
}

const usePostStore = create<PostStoreInterface>((set, get) => ({
  posts: [],
  setPosts: (posts) => set({ posts }),
  fetchPostLoading: false,

  fetchPosts: async () => {
    set({
      fetchPostLoading: true,
    });
    try {
      console.log(get().posts);
      console.log("--------------------------");

      const response = await axios.get("/api/post");
      const data = response.data.data as postInterface[];

      set({
        posts: data,
      });

      console.log("--------------------------");
      console.log(get().posts);

      set({
        fetchPostLoading: false,
      });
    } catch (error) {
      set({
        fetchPostLoading: false,
      });
    }
  },
}));

export default usePostStore;
