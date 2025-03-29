import PostCommentInterface from "./comment.interface";
import ProjectInterface from "./project.interface";
import UserInterface from "./user.interface";

interface postInterface {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date | null;
  userId: string;
  access: postAccess;
  shared?: boolean;
  likes: { id: string; postId: string; userId: string }[];
  bookmarks: { id: string; postId: string; userId: string }[];
  user: UserInterface;
  media: { id: string; url: string; type: string }[]; // Add media field
  replies?: PostCommentInterface[];
  project?: ProjectInterface;
}

enum postAccess {
  private,
  public,
}

export default postInterface;
