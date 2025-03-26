import UserInterface from "./user.interface";

interface ProjectInterface {
  id: string;
  name: string;
  description: string;
  status: string;
  category: string[];
  createdAt: Date;
  image: string;
  userId: string;
  user: UserInterface;
  access: string;
  _count: {
    stars: number;
    followers: number;
  };
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
