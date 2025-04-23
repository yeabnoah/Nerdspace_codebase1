import axios from "axios";
import getUserSession from "./get-user";
import { Notification } from "@/api/notification";

const getNotifications = async (): Promise<Notification[] | null> => {
  const session = await getUserSession();

  if (!session) {
    return null;
  }

  try {
    const response = await axios.get("/api/notification");
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return null;
  }
};

export default getNotifications;
