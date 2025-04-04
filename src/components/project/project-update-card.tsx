"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import {
  EditIcon,
  Heart,
  MessageSquare,
  MoreHorizontal,
  ShareIcon,
  Trash,
  Trash2Icon,
  TrashIcon,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  commentType,
  UpdateInterface,
} from "@/interface/auth/project.interface";
import { queryClient } from "@/providers/tanstack-query-provider";
import useUserStore from "@/store/user.store";
import { authClient } from "@/lib/auth-client";
import useProjectUpdateStore from "@/store/project-update.store";

export default function UpdateCard({
  update,
  initialLikes = 0,
  initialComments = 0,
  isOwner,
}: {
  update: UpdateInterface;
  initialLikes?: number;
  initialComments?: number;
  isOwner: boolean;
}) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [showComments, setShowComments] = useState(false); // State to toggle comments
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false); // State for edit dialog
  const [isCommentDeleteDialogOpen, setIsCommentDeleteDialogOpen] =
    useState(false); // State for comment delete dialog
  const [editingComment, setEditingComment] = useState<{
    id: string;
    content: string;
  } | null>(null);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(
    null,
  ); // State for comment to delete
  const [newComment, setNewComment] = useState(""); // State for new comment input
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false); // State for share dialog
  const [isDeleteCardDialogOpen, setIsDeleteCardDialogOpen] = useState(false); // State for delete card dialog
  const session = authClient.useSession();

  const { setProjectUpdate, projectUpdate } = useProjectUpdateStore();

  // Fetch if the user has liked the update
  const { data: liked, isLoading: isLikedLoading } = useQuery({
    queryKey: ["updateLiked", update.id],
    queryFn: async () => {
      const response = await axios.get(
        `/api/project/update/like?updateId=${update.id}`,
      );
      return response.data.liked;
    },
  });

  // Fetch comments for the update
  const { data: comments = [], isLoading: isCommentsLoading } = useQuery({
    queryKey: ["updateComments", update.id],
    queryFn: async () => {
      const response = await axios.get(
        `/api/project/update/comment?updateId=${update.id}`,
      );
      return response.data.data;
    },
  });

  // Mutation for liking/unliking the update
  const likeMutation = useMutation({
    mutationFn: async () => {
      await axios.post(`/api/project/update/like?updateId=${update.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["updateLiked", update.id] });
      queryClient.invalidateQueries({ queryKey: ["project"] });
    },
    onError: () => {
      toast.error("Failed to update like. Please try again.");
    },
  });

  // Mutation for adding a comment
  const addCommentMutation = useMutation({
    mutationFn: async (content: string) => {
      await axios.post(`/api/project/update/comment?updateId=${update.id}`, {
        content,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["updateComments", update.id],
      });
      toast.success("Comment added successfully.");
    },
    onError: () => {
      toast.error("Failed to add comment. Please try again.");
    },
  });

  // Mutation for deleting a comment
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      await axios.delete(`/api/project/update/comment?commentId=${commentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["updateComments", update.id],
      });
      setIsCommentDeleteDialogOpen(false); // Close the delete dialog
      toast.success("Comment deleted successfully."); // Single toast
    },
    onError: () => {
      toast.error("Failed to delete comment. Please try again.");
    },
  });

  const postAsPostMutation = useMutation({
    mutationKey: ["postaspost", projectUpdate?.id],
    mutationFn: async () => {
      if (!projectUpdate) {
        throw new Error("Project update is not defined.");
      }

      const response = await axios.post(
        `/api/project/update/share`,
        {
          content: `${projectUpdate.title || ""} ${projectUpdate.content || ""}`,
          fileUrls: projectUpdate.image ? [projectUpdate.image] : [],
          projectId: projectUpdate.projectId,
        },
        { withCredentials: true },
      );

      return response.data.data;
    },
    onSuccess: () => {
      toast.success("Update posted as post");
      setIsShareDialogOpen(false); // Close the share dialog on success
    },
    onError: () => {
      toast.error("Error occurred while trying to post update as post");
    },
  });

  // Mutation for updating a comment
  const updateCommentMutation = useMutation({
    mutationFn: async ({
      commentId,
      content,
    }: {
      commentId: string;
      content: string;
    }) => {
      await axios.patch(`/api/project/update/comment?commentId=${commentId}`, {
        content,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["updateComments", update.id],
      });
      setIsEditDialogOpen(false); // Close the edit dialog
      toast.success("Comment updated successfully."); // Single toast
    },
    onError: () => {
      toast.error("Failed to update comment. Please try again.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await axios.delete(`/api/project/update/${id}`);
    },
    onSuccess: () => {
      toast.success("Update deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["project"] }); // Invalidate project query
    },
    onError: () => {
      toast.error("Failed to delete update. Please try again.");
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(update.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false); // Close the dialog after successful deletion
        queryClient.invalidateQueries({ queryKey: ["project"] }); // Invalidate project query
        toast.success("Update deleted successfully");
      },
      onError: () => {
        toast.error("Failed to delete update. Please try again.");
      },
    });
  };

  const handleDeleteCard = () => {
    deleteMutation.mutate(update.id, {
      onSuccess: () => {
        setIsDeleteCardDialogOpen(false); // Close the dialog after successful deletion
        queryClient.invalidateQueries({ queryKey: ["project"] }); // Invalidate project query
        toast.success("Update deleted successfully");
      },
      onError: () => {
        toast.error("Failed to delete update. Please try again.");
      },
    });
  };

  const handleLike = () => {
    likeMutation.mutate();
  };

  const handleToggleComments = () => {
    setShowComments((prev) => !prev);
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      addCommentMutation.mutate(newComment.trim());
      setNewComment(""); // Clear the input field after submission
    }
  };

  const handleDeleteComment = (commentId: string) => {
    deleteCommentMutation.mutate(commentId, {
      onError: () => {
        toast.error("Failed to delete comment. Please try again.");
      },
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["updateComments", update.id],
        });
        setIsCommentDeleteDialogOpen(false);
        setProjectUpdate;
        toast.success("Comment deleted successfully.");
      },
    });
  };

  const handleUpdateComment = (commentId: string, content: string) => {
    updateCommentMutation.mutate(
      { commentId, content },
      {
        onError: () => {
          toast.error("Failed to update comment. Please try again.");
        },
        onSuccess: () => {
          queryClient.invalidateQueries({
            queryKey: ["updateComments", update.id],
          });
          setIsEditDialogOpen(false); // Close the edit dialog
          toast.success("Comment updated successfully.");
        },
      },
    );
  };

  const handleOpenEditDialog = (commentId: string, content: string) => {
    setEditingComment({ id: commentId, content });
    setIsEditDialogOpen(true);
  };

  const handleEditComment = () => {
    if (editingComment) {
      handleUpdateComment(editingComment.id, editingComment.content);
      setIsEditDialogOpen(false);
    }
  };

  const handleOpenDeleteCommentDialog = (commentId: string) => {
    setDeletingCommentId(commentId);
    setIsCommentDeleteDialogOpen(true);
  };

  const handleConfirmDeleteComment = () => {
    if (deletingCommentId) {
      handleDeleteComment(deletingCommentId);
      setIsCommentDeleteDialogOpen(false);
    }
  };

  // Format the date to be more readable
  const formattedDate = formatDistanceToNow(new Date(update.createdAt), {
    addSuffix: true,
  });

  // Get user initials for avatar fallback
  const userInitials = update.userId.substring(0, 2).toUpperCase();

  return (
    <TooltipProvider>
      <Card className="my-4 overflow-hidden rounded-lg border bg-card shadow-md transition hover:shadow-lg">
        <div className="flex flex-col">
          <CardContent className="p-4">
            <div className="relative mb-4 h-48 w-full overflow-hidden rounded-md">
              <Image
                src={update.image || "/placeholder.svg"}
                alt={update.title}
                width={1000}
                height={1000}
                className="h-full w-full object-cover"
                priority
              />
            </div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-primary">
                {update.title}
              </h3>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className="text-sm">{formattedDate}</span>
                {isOwner && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 rounded-full"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={() => setIsDeleteCardDialogOpen(true)} // Open delete card dialog
                        className="text-red-500"
                      >
                        <TrashIcon />
                        Delete
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {
                          setProjectUpdate(update);
                          setIsShareDialogOpen(true);

                          console.log();
                        }} // Open share dialog
                      >
                        <ShareIcon />
                        Share
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
            <p className="mb-4 text-sm text-muted-foreground">
              {update.content}
            </p>
            <div className="flex items-center justify-between border-t pt-4">
              <div className="flex items-center gap-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2 text-sm"
                      onClick={handleLike}
                      disabled={isLikedLoading || likeMutation.isPending}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          liked ? "fill-destructive text-destructive" : ""
                        }`}
                      />
                      <span>{update?.likes.length}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-xs">Like this update</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2 text-sm"
                      onClick={handleToggleComments}
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>{update?.comments.length}</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p className="text-xs">Comment on this update</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <span className="text-sm text-muted-foreground">
                ID: {update.id.substring(0, 6)}
              </span>
            </div>
          </CardContent>

          {showComments && (
            <div className="border-t bg-muted/10 p-4">
              <div className="mb-4 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="flex-1 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:ring focus:ring-primary/30"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddComment}
                  disabled={addCommentMutation.isPending}
                >
                  Send
                </Button>
              </div>
              {isCommentsLoading ? (
                <p className="text-sm text-muted-foreground">
                  Loading comments...
                </p>
              ) : comments.length > 0 ? (
                comments.map((comment: commentType) => (
                  <div
                    key={comment.id}
                    className="mb-4 flex items-start gap-3 rounded-md bg-muted/20 p-3"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {comment?.user?.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                      <AvatarImage src={comment?.user?.image as string} />
                    </Avatar>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{comment.content}</p>
                      <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          {formatDistanceToNow(new Date(comment.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                        {comment.user.id === session?.data?.user?.id && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                handleOpenDeleteCommentDialog(comment.id)
                              }
                              className="text-red-500 hover:underline"
                            >
                              <TrashIcon size={14} />
                            </button>
                            <button
                              onClick={() =>
                                handleOpenEditDialog(
                                  comment.id,
                                  comment.content,
                                )
                              }
                              className="text-blue-500 hover:underline"
                            >
                              <EditIcon size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No comments yet.
                </p>
              )}
            </div>
          )}

          {/* Delete Comment Confirmation Dialog */}
          <Dialog
            open={isCommentDeleteDialogOpen}
            onOpenChange={setIsCommentDeleteDialogOpen}
          >
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Delete Comment</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this comment? This action
                  cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCommentDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    if (deletingCommentId)
                      handleDeleteComment(deletingCommentId);
                  }}
                >
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Edit Comment Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Edit Comment</DialogTitle>
                <DialogDescription>
                  Update your comment below.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-2">
                <textarea
                  className="w-full rounded-md border px-2 py-1 text-sm"
                  rows={3}
                  value={editingComment?.content || ""}
                  onChange={(e) =>
                    setEditingComment((prev) =>
                      prev ? { ...prev, content: e.target.value } : prev,
                    )
                  }
                />
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (editingComment) {
                      handleUpdateComment(
                        editingComment.id,
                        editingComment.content,
                      );
                    }
                  }}
                >
                  Save
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Share Update Dialog */}
          <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Share Update</DialogTitle>
                <DialogDescription>
                  Do you wanna share the update as a post ??
                </DialogDescription>
              </DialogHeader>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsShareDialogOpen(false)}
                >
                  Close
                </Button>
                <Button
                  variant="outline"
                  onClick={async () => {
                    await postAsPostMutation.mutate();
                  }}
                >
                  share as post
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Card Confirmation Dialog */}
          <Dialog
            open={isDeleteCardDialogOpen}
            onOpenChange={setIsDeleteCardDialogOpen}
          >
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Delete Update</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this update? This action
                  cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDeleteCardDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDeleteCard}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </Card>
    </TooltipProvider>
  );
}
