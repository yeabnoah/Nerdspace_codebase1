import postInterface from "@/interface/auth/post.interface";
import axios from "axios";

const fetchPosts = async () => {
  const response = await axios.get("/api/post");
  return response.data.data as postInterface[];
};

export default fetchPosts;
