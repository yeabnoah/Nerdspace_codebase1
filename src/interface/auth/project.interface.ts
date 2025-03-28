import UserInterface from "./user.interface";

type likeType = {
  id: string;
  userId: string;
  updateId: string;
};

type commentType = {
  id: string;
  userId: string;
  updateId: string;
  content: string;
  createdAt: string;
  updatedAt: String;
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
  status: "COMPLETED" | "IN_PROGRESS" | "DRAFT"; // Add more statuses if needed
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
