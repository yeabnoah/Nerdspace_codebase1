import UserInterface from "./user.interface";

type likeType = {
  id: string;
  userId: string;
  updateId: string;
};

interface starProject {
  id: String;
  userId: String;
  projectId: String;
}

type ProjectFollowers = {
  id: String;
  userId: String;
  projectId: String;
};

type reviewFollowers = {
  id: String;
  userId: String;
  projectId: String;
  content: String;
};

export type commentType = {
  id: string;
  userId: string;
  updateId: string;
  content: string;
  createdAt: string;
  updatedAt: String;
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
  reviews: reviewFollowers[];
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
