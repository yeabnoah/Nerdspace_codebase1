import PostCommentInterface from "./comment.interface";

interface postInterface {
  id: string;
  content: string;
  createdAt: Date | null;
  updatedAt: Date | null;
  userId: string;
  access: postAccess;
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
  replies?: PostCommentInterface[];
}

enum postAccess {
  private,
  public,
}

export default postInterface;
