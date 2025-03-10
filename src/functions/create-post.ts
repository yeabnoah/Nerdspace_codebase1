import axios from "axios";

const createPost = async (data: { content: string }) => {
  const response = await axios.post("/api/post", data, {
    withCredentials: true,
  });
  return response.data.data;
};

export default createPost;
