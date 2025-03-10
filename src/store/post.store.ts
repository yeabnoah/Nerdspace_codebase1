import { create } from "zustand";
import axios from "axios";
import toast from "react-hot-toast";
import { postSchema } from "@/validation/post.validation";
import postInterface from "@/interface/auth/post.interface";

interface PostStoreInterface {
  posts: postInterface[];
  setPosts: (posts: postInterface[]) => void;
  fetchPosts: () => void;
  fetchPostLoading: boolean;
  createPost: (content: string) => Promise<void>;
}

const usePostStore = create<PostStoreInterface>((set, get) => ({
  posts: [],
  setPosts: (posts) => set({ posts }),
  fetchPostLoading: false,

  fetchPosts: async () => {
    set({ fetchPostLoading: true });

    try {
      const response = await axios.get("/api/post");
      const data = response.data.data as postInterface[];

      set({ posts: data });
    } catch (error) {
      toast.error("Error fetching posts. Please try again.");
    } finally {
      set({ fetchPostLoading: false });
    }
  },

  createPost: async (content: string) => {
    const checkedType = postSchema.safeParse({ content });

    if (checkedType.error) {
      toast.error("Invalid post content. Please try again.");
      return;
    }

    try {
      const response = await axios.post("/api/post", { content });

      if (response.status === 200) {
        toast.success("Post created successfully.");
        get().fetchPosts();
      } else {
        toast.error(response.data.message || "An error occurred.");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to create post. Please try again.",
      );
    }
  },
}));

export default usePostStore;
