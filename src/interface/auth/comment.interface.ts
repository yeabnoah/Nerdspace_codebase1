import UserInterface from "./user.interface";

interface PostCommentInterface {
  id: string;
  userId: string;
  postId: string;
  parentId?: string | null;
  content: string;
  replies: PostCommentInterface[]; // Nested replies
  createdAt: Date;
  user?: UserInterface;
}

export default PostCommentInterface;
