import axios from "axios";

const fetchPosts = async ({ pageParam }: { pageParam: string | null }) => {
  const response = await axios.get("/api/post", {
    params: { cursor: pageParam },
  });

  console.log("posts fetached", response.data);
  return response.data;
};

export default fetchPosts;
