import PostCommentInterface from "./comment.interface";

interface postInterface {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date | null;
  userId: string;
  access: postAccess;
  likes: { id: string; postId: string; userId: string }[];
  bookmarks: { id: string; postId: string; userId: string }[];
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
  media: { id: string; url: string; type: string }[]; // Add media field
  replies?: PostCommentInterface[];
}

enum postAccess {
  private,
  public,
}

export default postInterface;
