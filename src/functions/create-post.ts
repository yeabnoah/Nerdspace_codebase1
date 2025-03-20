import axios from "axios";

const createPost = async (data: { content: string; fileUrls: string[] }) => {
  const response = await axios.post("/api/post", data, {
    withCredentials: true,
  });

  console.log("user sent this", data);
  return response.data.data;
};

export default createPost;
