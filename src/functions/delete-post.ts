import usePostStore from "@/store/post.store";
import axios from "axios";

const deletePostFunction = async () => {
  const postState = usePostStore.getState();
  const response = await axios.delete("/api/post", {
    data: { id: postState.selectedPost.id },
  });

  return response.data;
};

export default deletePostFunction;
