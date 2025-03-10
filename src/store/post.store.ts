import postInterface from "@/interface/auth/post.interface";
import axios from "axios";
import { create } from "zustand";

interface PostStoreInterface {
  posts: postInterface[];
}

const usePostStore = create<PostStoreInterface>((set, get) => ({
  posts: [],
}));

export default usePostStore;
