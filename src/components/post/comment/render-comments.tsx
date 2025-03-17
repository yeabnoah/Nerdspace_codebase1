import { Button } from "@/components/ui/button";
import { timeAgo } from "@/functions/calculate-time-difference";
import PostCommentInterface from "@/interface/auth/comment.interface";
import {
  ChevronDown,
  ChevronRight,
  Dot,
  MessageCircleIcon,
  SendIcon,
} from "lucide-react";
import Image from "next/image";

interface RenderCommentsProps {
  comments: PostCommentInterface[];
  parentId: String | null;
  level: number;
  expandedComments: { [key: string]: boolean };
  toggleCommentExpand: (commentId: string) => void;
  replyShown: { [key: string]: boolean };
  toggleReplyShown: (commentId: string) => void;
  replyContent: { [key: string]: string };
  setReplyContent: React.Dispatch<
    React.SetStateAction<{ [key: string]: string }>
  >;
  handleReplySubmit: (commentId: string) => void;
  expandedReplies: { [key: string]: boolean };
  toggleReplies: (commentId: string) => void;
}

export const renderComments = ({
  comments,
  parentId,
  level,
  expandedComments,
  toggleCommentExpand,
  replyShown,
  toggleReplyShown,
  replyContent,
  setReplyContent,
  handleReplySubmit,
  expandedReplies,
  toggleReplies,
}: RenderCommentsProps) => {
  return (
    comments &&
    comments
      .filter((comment: PostCommentInterface) => comment?.parentId === parentId)
      .map((comment) => {
        const contentWords = comment.content.split(" ");
        const trimLimit = 20; // Adjust the trim limit as needed
        const truncatedContent = contentWords.slice(0, trimLimit).join(" ");
        const isLongContent = contentWords.length > trimLimit;

        return (
          <div
            key={comment.id}
            className={`relative my-1 py-2 ml-${level * 4} pl-4`}
          >
            <div className="absolute left-0 top-0 ml-4 h-full w-6 rounded-l border-b border-l border-t-0 border-white/5"></div>
            <div className="flex items-center justify-between pl-2">
              <div className="flex gap-2">
                <Image
                  className="size-8 rounded-full"
                  src={comment.user?.image || "/user.jpg"}
                  height={200}
                  width={200}
                  alt="user"
                />
                <div className="flex items-center">
                  <h4 className="text-xs">{comment?.user?.visualName}</h4>
                  <Dot />
                  <p className="text-xs">{timeAgo(comment.createdAt)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="rounded-xl border p-2"
                  onClick={() => {
                    toggleReplyShown(comment.id);
                  }}
                >
                  <MessageCircleIcon size={16} className="" />
                </button>
                <button
                  className="rounded-xl border p-2"
                  onClick={() => toggleReplies(comment.id)}
                >
                  {expandedReplies[comment.id] ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>
              </div>
            </div>

            <div className="mt-2 w-[90%] pl-4">
              <p className="text-xs">
                {expandedComments[comment.id] || !isLongContent
                  ? comment.content
                  : `${truncatedContent}...`}
              </p>
              {isLongContent && (
                <button
                  className="mt-2 text-xs underline"
                  onClick={() => toggleCommentExpand(comment.id)}
                >
                  {expandedComments[comment.id] ? "See less" : "See more"}
                </button>
              )}
              {expandedComments[comment.id] &&
                renderComments({
                  comments,
                  parentId: comment?.id,
                  level: level + 1,
                  expandedComments,
                  toggleCommentExpand,
                  replyShown,
                  toggleReplyShown,
                  replyContent,
                  setReplyContent,
                  handleReplySubmit,
                  expandedReplies,
                  toggleReplies,
                })}
            </div>

            {replyShown[comment.id] && (
              <div className="mt-2 flex items-start gap-2 pl-8">
                <input
                  placeholder="Reply here"
                  className="w-full border-0 border-b border-white/5 bg-transparent p-1 text-sm placeholder:font-instrument placeholder:text-lg focus:border-b focus:border-gray-500 focus:outline-none focus:ring-0"
                  value={replyContent[comment.id] || ""}
                  onChange={(e) =>
                    setReplyContent((prev) => ({
                      ...prev,
                      [comment.id]: e.target.value,
                    }))
                  }
                />
                <Button
                  className="mt-2 rounded-lg border bg-transparent px-2 py-1 hover:bg-transparent focus:outline-none focus:ring-0"
                  onClick={() => handleReplySubmit(comment.id)}
                >
                  <SendIcon color="white" size={8} />
                </Button>
              </div>
            )}

            {expandedReplies[comment.id] &&
              renderComments({
                comments,
                parentId: comment.id,
                level: level + 1,
                expandedComments,
                toggleCommentExpand,
                replyShown,
                toggleReplyShown,
                replyContent,
                setReplyContent,
                handleReplySubmit,
                expandedReplies,
                toggleReplies,
              })}
          </div>
        );
      })
  );
};
