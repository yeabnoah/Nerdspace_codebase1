import deletePostFunction from "@/functions/delete-post";
import postInterface from "@/interface/auth/post.interface";
import { queryClient } from "@/providers/tanstack-query-provider";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle
} from "../ui/dialog";

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
    onSuccess: async () => {
      toast.success("Post deleted successfully");
      setDeleteModal(false);
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["my-posts"] });
      queryClient.invalidateQueries({ queryKey: ["my-private-posts"] });
      queryClient.invalidateQueries({ queryKey: ["Privateposts"] });
    },
    onError: () => {
      toast.error("Error occurred while deleting post");
    },
  });

  const handleDelete = async () => {
    await mutation.mutate();
  };

  return (
    <Dialog open={deleteModal} onOpenChange={setDeleteModal}>
      <DialogContent className="max-w-md overflow-hidden rounded-xl border-none p-0 backdrop-blur-sm">
        <DialogTitle></DialogTitle>
        <div className="relative flex flex-col">
          {/* Glow effects */}
          <div className="absolute -right-4 size-32 -rotate-45 rounded-full border border-red-300/50 bg-gradient-to-br from-red-300/40 via-red-400/50 to-transparent blur-[150px] backdrop-blur-sm"></div>
          <div className="absolute -bottom-5 left-12 size-32 rotate-45 rounded-full border border-orange-300/50 bg-gradient-to-tl from-orange-300/40 via-orange-400/30 to-transparent blur-[150px] backdrop-blur-sm"></div>

          <div className="flex w-full flex-col px-6 pb-3">
            <div className="mb-2 font-geist text-3xl font-medium">
              Delete Post
            </div>
            <p className="mb-6 font-geist text-muted-foreground">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>

            <div className="mt-8 flex justify-end gap-3 border-t pt-4 font-geist dark:border-gray-500/5">
              <Button
                variant="outline"
                className="h-11 w-24 rounded-2xl"
                onClick={() => setDeleteModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                className="h-11 w-24 rounded-2xl"
                onClick={handleDelete}
                disabled={mutation.isPending}
              >
                {mutation.isPending ? "Deleting..." : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
