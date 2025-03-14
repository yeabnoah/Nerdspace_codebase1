import axios from "axios";

const fetchMyPosts = async ({ pageParam }: { pageParam: string | null }) => {
  const response = await axios.get("/api/whoami/post", {
    params: { cursor: pageParam },
    withCredentials: true,
  });
  return response.data;
};

export default fetchMyPosts;
