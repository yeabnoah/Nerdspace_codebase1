import axios from "axios";

export interface Notification {
  id: string;
  type: string;
  message: string;
  createdAt: string;
  read: boolean;
  actor: {
    name: string;
    image: string;
  } | null;
  post: {
    id: string;
  } | null;
  project: {
    id: string;
  } | null;
  community: {
    id: string;
  } | null;
}

export const notificationApi = {
  getNotifications: async () => {
    const { data } = await axios.get<Notification[]>("/api/notification");
    return data;
  },

  markAsRead: async () => {
    const { data } = await axios.patch("/api/notification");
    return data;
  },
};
