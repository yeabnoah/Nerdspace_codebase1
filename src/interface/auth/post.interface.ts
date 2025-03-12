interface postInterface {
  id: string;
  content: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  userId: string;
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    image: string;
    createdAt: Date | null;
    updatedAt: Date | null;
    nerdAt: null | string;
  };
}

export default postInterface;
