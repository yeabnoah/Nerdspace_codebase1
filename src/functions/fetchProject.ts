import axios from "axios";

export const fetchProject = async (id: string) => {
  const response = await axios.get(`/api/project/${id}`);
  return response.data.data;
};
