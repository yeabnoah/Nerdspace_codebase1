import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { AutosizeTextarea } from "../ui/resizeble-text-area";
import postInterface from "@/interface/auth/post.interface";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import editPostFunction from "@/functions/edit-post";
import toast from "react-hot-toast";
import { queryClient } from "@/providers/tanstack-query-provider";
import { Loader } from "lucide-react";

const EditModal = ({
  selectedPost,
  setEditModal,
  editModal,
  content,
  setContent,
}: {
  selectedPost: postInterface;
  setEditModal: (open: boolean) => void;
  editModal: boolean;
  content: string;
  setContent: (content: string) => void;
}) => {
  const mutation = useMutation({
    mutationKey: ["edit-post"],
    mutationFn: editPostFunction,
    onSuccess: () => {
      toast.success("updated post successfully");
      setEditModal(false);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
      queryClient.invalidateQueries({ queryKey: ["my-private-posts"] });
      queryClient.invalidateQueries({ queryKey: ["Privateposts"] });
    },
    onError: () => {
      toast.error("error occured while updating post");
    },
  });

  const editPost = async () => {
    await mutation.mutate();
  };

  return (
    <Dialog open={editModal} onOpenChange={setEditModal}>
      <DialogContent className="max-w-[90%] rounded-xl dark:bg-textAlternative md:max-w-[45%]">
        <DialogHeader>
          <DialogTitle className="text-start">Edit Post</DialogTitle>
        </DialogHeader>
        <AutosizeTextarea
          maxHeight={300}
          className="bg-transparent"
          value={content}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setContent(e.target.value);
          }}
        />
        <DialogFooter className="gap-3">
          <Button
            disabled={mutation.isPending}
            onClick={() => {
              setEditModal(false);
            }}
          >
            Cancel
          </Button>
          <Button onClick={editPost} disabled={mutation.isPending}>
            {mutation.isPending && <Loader />}
            {mutation.isPending ? "Updating ..." : "Update"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditModal;
