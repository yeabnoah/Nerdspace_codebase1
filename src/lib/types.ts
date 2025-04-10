export type User = {
  id: string;
  name: string;
  email: string;
  image?: string;
};

export type Community = {
  id: string;
  name: string;
  description: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  creatorId: string;
  members: CommunityMembership[];
  posts: CommunityPost[];
  categoryId?: string;
};

export type CommunityMembership = {
  id: string;
  userId: string;
  communityId: string;
  role: CommunityRole;
  joinedAt: Date;
  user?: User;
};

export type CommunityPost = {
  id: string;
  image?: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  communityId: string;
  user: {
    id: string;
    name: string;
    username: string;
    image?: string;
    isFollowing?: boolean;
  };
  likes: Like[];
  comments: PostComment[];
};

export type CommunityCategory = {
  id: string;
  name: string;
};

export type CommunityRole = "ADMIN" | "MODERATOR" | "MEMBER";

export type Like = {
  id: string;
  userId: string;
  postId: string;
};

export type PostComment = {
  id: string;
  content: string;
  createdAt: Date;
  userId: string;
  postId: string;
};
