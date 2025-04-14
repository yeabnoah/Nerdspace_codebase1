import UserInterface from "./user.interface";

type likeType = {
  id: string;
  userId: string;
  updateId: string;
};

interface starProject {
  id: string;
  userId: string;
  projectId: string;
}

export type ProjectFollowers = {
  id: string;
  userId: string;
  projectId: string;
};

export type reviewProject = {
  id: string;
  userId: string;
  projectId: string;
  content: string;
  user: UserInterface;
  createdAt: string;
};

export type commentType = {
  id: string;
  userId: string;
  updateId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: UserInterface;
};

export interface UpdateInterface {
  id: string;
  title: string;
  image: string;
  content: string;
  projectId: string;
  createdAt: string;
  userId: string;
  likes: likeType[];
  comments: commentType[];
}

interface ProjectInterface {
  id: string;
  name: string;
  description: string;
  image: string;
  userId: string;
  status: "COMPLETED" | "IN_PROGRESS" | "DRAFT";
  category: string[];
  access: "public" | "private";
  createdAt: string;
  members?: UserInterface[];
  tags?: string[];
  _count: {
    updates: number;
    stars: number;
    ratings: number;
    reviews: number;
    followers: number;
  };
  user: UserInterface;
  updates: UpdateInterface[];
  stars: starProject[];
  followers: ProjectFollowers[];
  reviews: reviewProject[];
  nextCursor: string;
}

export interface ProjectInterfaceToSubmit {
  name: string;
  description: string;
  category: string[];
  access: "public" | "private";
  status: "ONGOING" | "COMPLETED" | "PAUSED" | "CANCELLED";
  image: string;
}

export default ProjectInterface;
