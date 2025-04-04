import PostCommentInterface from "@/interface/auth/comment.interface";
import UserInterface from "@/interface/auth/user.interface";

export interface CommunityInterface {
  id: string;
  name: string;
  description: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
  creatorId: string;
  creator: UserInterface;
  members: CommunityMembership[];
  posts: CommunityPost[];
  categoryId?: string;
  category?: CommunityCategory;
}

interface CommunityMembership {
  id: string;
  userId: string;
  communityId: string;
  role: CommunityRole;
  user: UserInterface;
  community: CommunityInterface;
  joinedAt: Date;
}

interface CommunityPost {
  id: string;
  image?: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  communityId: string;
  user: UserInterface;
  community: CommunityInterface;
  likes: { id: string; postId: string; userId: string }[];
  comments: PostCommentInterface[];
}

interface CommunityCategory {
  id: string;
  name: string;
  communities: CommunityInterface[];
}

enum CommunityRole {
  ADMIN = "ADMIN",
  MODERATOR = "MODERATOR",
  MEMBER = "MEMBER",
}
