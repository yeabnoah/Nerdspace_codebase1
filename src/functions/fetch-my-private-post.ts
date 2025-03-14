import axios from "axios";

const fetchMyPrivatePosts = async ({
  pageParam,
}: {
  pageParam: string | null;
}) => {
  const response = await axios.get("/api/whoami/private", {
    params: { cursor: pageParam },
    withCredentials: true,
  });
  return response.data;
};

export default fetchMyPrivatePosts;
