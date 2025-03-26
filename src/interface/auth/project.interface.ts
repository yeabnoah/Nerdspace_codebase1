import UserInterface from "./user.interface";

interface ProjectInterface {
  id: string;
  name: string;
  description: string;
  status: string;
  category: string[];
  createdAt: Date;
  image: string;
  user: {
    name: string;
    image: string;
  };
  access: string;
  _count: {
    stars: number;
    followers: number;
  };
}

export default ProjectInterface;
