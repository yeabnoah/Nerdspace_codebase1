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
import usePostStore from "@/store/post.store";

const EditModal = ({
  incasePost,
  setEditModal,
  editModal,
  incaseContent,
}: {
  incasePost: postInterface;
  setEditModal: (open: boolean) => void;
  editModal: boolean;
  incaseContent: string;
}) => {
  const { content, setContent, selectedPost } = usePostStore();

  const mutation = useMutation({
    mutationKey: ["edit-post"],
    mutationFn: () =>
      editPostFunction({
        id: selectedPost?.id || incasePost.id,
        content: content || incaseContent,
      }),
    onSuccess: async () => {
      toast.success("Post edited successfully");
      setEditModal(false);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
      queryClient.invalidateQueries({ queryKey: ["my-private-posts"] });
      queryClient.invalidateQueries({ queryKey: ["Privateposts"] });
    },
    onError: () => {
      toast.error("Error occurred while editing post");
    },
  });

  const handleEdit = async () => {
    console.log(selectedPost);
    await mutation.mutate();
  };

  return (
    <Dialog open={editModal} onOpenChange={setEditModal}>
      <DialogContent
        className="max-w-md overflow-hidden rounded-xl border-none p-0 backdrop-blur-sm"
        aria-describedby="edit-post-description"
      >
        <DialogTitle></DialogTitle>
        <div className="relative flex flex-col">
          {/* Glow effects */}
          <div className="absolute -right-4 size-32 -rotate-45 rounded-full border border-primary/50 bg-gradient-to-br from-primary/40 via-primary/50 to-transparent blur-[150px] backdrop-blur-sm"></div>
          <div className="absolute -bottom-5 left-12 size-32 rotate-45 rounded-full border border-secondary/50 bg-gradient-to-tl from-secondary/40 via-secondary/30 to-transparent blur-[150px] backdrop-blur-sm"></div>

          <div className="flex w-full flex-col px-6 pb-3">
            <div className="post mb-2 font-geist text-3xl font-medium">
              Edit Post
            </div>
            <p
              id="edit-post-description"
              className="mb-6 font-geist text-muted-foreground"
            >
              Make changes to your post content
            </p>

            <div className="space-y-4">
              <AutosizeTextarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[120px] rounded-xl border-none bg-background/50 shadow-sm backdrop-blur-sm focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Edit your post..."
              />
            </div>

            <div className="mt-8 flex justify-end gap-3 border-t pt-4 font-geist dark:border-gray-500/5">
              <Button
                variant="outline"
                className="h-11 w-24 rounded-2xl"
                onClick={() => setEditModal(false)}
              >
                Cancel
              </Button>
              <Button
                className="h-11 w-24 rounded-2xl"
                onClick={handleEdit}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditModal;

// {
//   postUserId: '1ITCapyEoTbXOzqlCOf5wMEblfkw0sDM',
//   sessionUserId: 'lndn47ueVWe8pvYj9eVx1M2RbQ5d87CR',
//   postId: 'a9da856e-51b8-4fd3-a9ce-85c4fd36d22c',
//   sessionId: 'lndn47ueVWe8pvYj9eVx1M2RbQ5d87CR'
// }
