import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea"; // Ensure Textarea component exists

interface EditCommentModalProps {
  commentId: string;
  postId: string; // Add postId to props
  initialContent: string;
  isOpen: boolean;
  onClose: () => void;
}

const EditCommentModal: React.FC<EditCommentModalProps> = ({
  commentId,
  postId, // Add postId to destructuring
  initialContent,
  isOpen,
  onClose,
}) => {
  const [content, setContent] = useState(initialContent);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newContent: string) => {
      await axios.put("/api/post/comment", {
        commentId,
        postId, // Include postId in the request body
        content: newContent,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comment"] });
      toast.success("Comment updated successfully");
      onClose();
    },
    onError: () => {
      toast.error("Error occurred while updating comment");
    },
  });

  const handleSubmit = () => {
    mutation.mutate(content);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Comment</DialogTitle>
        </DialogHeader>
        <Textarea
          className="mt-2"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <DialogFooter className="mt-4 flex justify-end gap-2">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={mutation.isPending}
            variant="default"
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditCommentModal;
