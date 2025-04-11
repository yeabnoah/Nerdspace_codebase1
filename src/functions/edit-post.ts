import axios from "axios";

const editPostFunction = async (data: { id: string; content: string }) => {
  const response = await axios.patch("/api/post", data);
  return response.data;
};

export default editPostFunction;
