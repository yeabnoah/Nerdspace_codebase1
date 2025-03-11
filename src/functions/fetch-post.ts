import postInterface from "@/interface/auth/post.interface";
import axios from "axios";

const fetchPosts = async ({ pageParam }: { pageParam: string | null }) => {
  const response = await axios.get("/api/post", {
    params: { cursor: pageParam },
  });
  return response.data;
};

export default fetchPosts;
