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
    name?: string;
  } | null;
  community: {
    id: string;
  } | null;
  comment?: {
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

  createNotification: async (params: {
    type: string;
    actorId: string;
    userId: string;
    postId?: string;
    commentId?: string;
    projectId?: string;
    communityId?: string;
    message?: string;
  }) => {
    const { data } = await axios.post("/api/notification", params);
    return data;
  },

  // Helper functions for common notifications
  createFollowNotification: async (followedUserId: string) => {
    const { data } = await axios.post("/api/user/follow-notification", {
      followedUserId,
    });
    return data;
  },

  // Project notifications using the dedicated endpoint
  createProjectNotification: async (
    type:
      | "PROJECT_STAR"
      | "PROJECT_FOLLOW"
      | "PROJECT_RATING"
      | "PROJECT_REVIEW"
      | "PROJECT_UPDATE",
    projectId: string,
    message?: string,
  ) => {
    const { data } = await axios.post("/api/project/notification", {
      type,
      projectId,
      message,
    });
    return data;
  },

  // Specific project notification helpers
  createProjectStarNotification: async (projectId: string) => {
    return notificationApi.createProjectNotification("PROJECT_STAR", projectId);
  },

  createProjectFollowNotification: async (projectId: string) => {
    return notificationApi.createProjectNotification(
      "PROJECT_FOLLOW",
      projectId,
    );
  },

  createProjectUpdateNotification: async (projectId: string) => {
    return notificationApi.createProjectNotification(
      "PROJECT_UPDATE",
      projectId,
    );
  },

  createProjectReviewNotification: async (projectId: string) => {
    return notificationApi.createProjectNotification(
      "PROJECT_REVIEW",
      projectId,
    );
  },

  createProjectRatingNotification: async (projectId: string) => {
    return notificationApi.createProjectNotification(
      "PROJECT_RATING",
      projectId,
    );
  },

  // Get notifications for a specific project
  getProjectNotifications: async (projectId: string) => {
    const { data } = await axios.get(
      `/api/project/notification?projectId=${projectId}`,
    );
    return data;
  },
};
