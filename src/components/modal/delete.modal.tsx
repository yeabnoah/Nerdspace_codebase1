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
import { DialogDescription } from "@radix-ui/react-dialog";
import deletePostFunction from "@/functions/delete-post";

const DeleteModal = ({
  selectedPost,
  setDeleteModal,
  deleteModal,
  content,
  setContent,
}: {
  selectedPost: postInterface;
  setDeleteModal: (open: boolean) => void;
  deleteModal: boolean;
  content: string;
  setContent: (content: string) => void;
}) => {
  const mutation = useMutation({
    mutationKey: ["delete-post"],
    mutationFn: deletePostFunction,
    onSuccess: () => {
      toast.success("post deleted successfully");
      setDeleteModal(false);
      queryClient.invalidateQueries({ queryKey: ["posts", "my-posts"] });
    },
    onError: () => {
      toast.error("error occured while deleting post");
    },
  });

  const deletePost = async () => {
    await mutation.mutate();
  };

  return (
    <Dialog open={deleteModal} onOpenChange={setDeleteModal}>
      <DialogContent className="rounded-xl dark:bg-textAlternative">
        <DialogHeader>
          <DialogTitle className="text-start">Are you sure ?</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to delete this post? This action cannot be
          undone.
        </DialogDescription>
        <DialogFooter className="gap-3">
          <Button
            disabled={mutation.isPending}
            onClick={() => {
              setDeleteModal(false);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
          onClick={deletePost} disabled={mutation.isPending}>
            {mutation.isPending && <Loader />}
            {mutation.isPending ? "Deleting ..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
