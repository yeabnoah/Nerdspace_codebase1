import usePostStore from "@/store/post.store";
import axios from "axios";

const editPostFunction = async () => {
  const postState = usePostStore.getState();
  const response = await axios.patch("/api/post", {
    content: postState.content,
    id: postState.selectedPost.id,
  });

  return response.data;
};

export default editPostFunction;
