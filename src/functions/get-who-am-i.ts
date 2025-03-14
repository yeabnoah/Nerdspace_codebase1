import useUserStore from "@/store/user.store";
import axios from "axios";

const getWhoAmI = async () => {
  const response = await axios.get("/api/whoami", {
    withCredentials: true,
  });

  useUserStore.setState((state) => ({
    user: response.data.data,
  }));

  return response.data;
};

export default getWhoAmI;
