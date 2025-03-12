import usePostStore from "@/store/post.store";
import axios from "axios";

const changePostAccess = async () => {
  const postState = usePostStore.getState();
  const response = await axios.patch("/api/security", {
    id: postState.selectedPost.id,
  });

  return response.data;
};

export default changePostAccess;
