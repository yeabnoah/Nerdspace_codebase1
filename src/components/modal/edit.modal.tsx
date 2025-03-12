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

const EditModal = ({
  selectedPost,
  setEditModal,
  editModal,
}: {
  selectedPost: postInterface;
  setEditModal: (open: boolean) => void;
  editModal: boolean;
}) => {
  return (
    <Dialog open={editModal} onOpenChange={setEditModal}>
      <DialogContent className="max-w-[90%] rounded-xl dark:bg-textAlternative md:max-w-[45%]">
        <DialogHeader>
          <DialogTitle className="text-start">Edit Post</DialogTitle>
        </DialogHeader>
        <AutosizeTextarea
          maxHeight={300}
          className="bg-transparent"
          value={selectedPost?.content}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            console.log(e);
          }}
        />
        <DialogFooter className="gap-3">
          <Button
            onClick={() => {
              setEditModal(false);
            }}
          >
            Cancel
          </Button>
          <Button>Update</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditModal;
