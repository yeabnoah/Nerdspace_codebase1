import axios, { AxiosError } from "axios";

export interface FollowUser {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  bio: string | null;
  nerdAt: Date | null;
  coverImage: string | null;
}

export interface FollowResponse {
  data: FollowUser[];
  pagination: {
    nextCursor: string | null;
    hasNextPage: boolean;
    total: number;
  };
}

export interface FollowStatus {
  isFollowing: boolean;
}

export class FollowError extends Error {
  constructor(
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = "FollowError";
  }
}

export const followService = {
  getFollowing: async (cursor?: string, limit: number = 10) => {
    try {
      const response = await axios.get<FollowResponse>("/api/users/following", {
        params: { cursor, limit },
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new FollowError(
          error.response?.data?.message || "Failed to fetch following",
          error.response?.status,
        );
      }
      throw new FollowError("Failed to fetch following");
    }
  },

  getFollowers: async (cursor?: string, limit: number = 10) => {
    try {
      const response = await axios.get<FollowResponse>("/api/users/followers", {
        params: { cursor, limit },
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new FollowError(
          error.response?.data?.message || "Failed to fetch followers",
          error.response?.status,
        );
      }
      throw new FollowError("Failed to fetch followers");
    }
  },

  getFollowStatus: async (userId: string) => {
    try {
      const response = await axios.get<FollowStatus>(
        `/api/users/${userId}/follow-status`,
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new FollowError(
          error.response?.data?.message || "Failed to fetch follow status",
          error.response?.status,
        );
      }
      throw new FollowError("Failed to fetch follow status");
    }
  },

  toggleFollow: async (userId: string, action: "follow" | "unfollow") => {
    try {
      const response = await axios.post<FollowStatus>(
        `/api/users/${userId}/follow-status`,
        { action },
      );
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new FollowError(
          error.response?.data?.message || `Failed to ${action} user`,
          error.response?.status,
        );
      }
      throw new FollowError(`Failed to ${action} user`);
    }
  },

  followUser: async (
    userId: string,
    action: "follow" | "unfollow" = "follow",
  ) => {
    try {
      const response = await axios.post(`/api/user/follow`, null, {
        params: { userId, action },
      });
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        throw new FollowError(
          error.response?.data?.message || `Failed to ${action} user`,
          error.response?.status,
        );
      }
      throw new FollowError(`Failed to ${action} user`);
    }
  },
};
