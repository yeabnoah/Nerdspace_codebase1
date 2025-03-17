import CommentSkeleton from "@/components/skeleton/comment.skelton";
import { Button } from "@/components/ui/button";
import { SendIcon } from "lucide-react";
import React, { JSX } from "react";
import PostCommentInterface from "@/interface/auth/comment.interface";

interface CommentComponentProps {
  commentContent: string;
  setCommentContent: React.Dispatch<React.SetStateAction<string>>;
  handleCommentSubmit: () => void;
  commentLoading: boolean;
  renderComments: (comments: PostCommentInterface[], parentId: string | null, level?: number) => JSX.Element[];
  comment: PostCommentInterface[];
}

const CommentComponent: React.FC<CommentComponentProps> = ({
  commentContent,
  setCommentContent,
  handleCommentSubmit,
  commentLoading,
  renderComments,
  comment,
}) => {
  return (
    <div>
      <hr className="mb-2 mt-5" />
      <div className="itemc flex gap-2">
        <input
          placeholder="Comment here"
          className="w-full border-0 border-b border-white/50 bg-transparent text-sm placeholder:font-instrument placeholder:text-lg focus:border-b focus:border-gray-500 focus:outline-none focus:ring-0"
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
        />
        <Button
          onClick={handleCommentSubmit}
          className="border bg-transparent hover:bg-transparent focus:outline-none focus:ring-0"
        >
          <SendIcon color="white" />
        </Button>
      </div>
      {commentLoading && <CommentSkeleton />}
      <div className="mt-4">{renderComments(comment, null)}</div>
    </div>
  );
};

export default CommentComponent;
