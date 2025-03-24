import PostCommentInterface from "./comment.interface";
import UserInterface from "./user.interface";

interface postInterface {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date | null;
  userId: string;
  access: postAccess;
  likes: { id: string; postId: string; userId: string }[];
  bookmarks: { id: string; postId: string; userId: string }[];
  user: UserInterface;
  media: { id: string; url: string; type: string }[]; // Add media field
  replies?: PostCommentInterface[];
}

enum postAccess {
  private,
  public,
}

export default postInterface;
