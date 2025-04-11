"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import Image from "next/image";
import {
  EditIcon,
  Heart,
  MessageSquare,
  MoreHorizontal,
  Send,
  Share,
  Trash2,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { useMutation, useQuery } from "@tanstack/react-query";
import type {
  commentType,
  UpdateInterface,
} from "@/interface/auth/project.interface";
import { queryClient } from "@/providers/tanstack-query-provider";
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
  const [showComments, setShowComments] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isCommentDeleteDialogOpen, setIsCommentDeleteDialogOpen] =
    useState(false);
  const [editingComment, setEditingComment] = useState<{
    id: string;
    content: string;
  } | null>(null);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(
    null,
  );
  const [newComment, setNewComment] = useState("");
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isDeleteCardDialogOpen, setIsDeleteCardDialogOpen] = useState(false);
  const [optimisticLikes, setOptimisticLikes] = useState(update.likes.length);
  const [optimisticLiked, setOptimisticLiked] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const session = authClient.useSession();

  const { setProjectUpdate, projectUpdate } = useProjectUpdateStore();

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setShowComments(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    onMutate: () => {
      // Optimistically update the UI
      setOptimisticLiked(!optimisticLiked);
      setOptimisticLikes((prev) => (optimisticLiked ? prev - 1 : prev + 1));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["updateLiked", update.id] });
      queryClient.invalidateQueries({ queryKey: ["project"] });
    },
    onError: () => {
      // Revert optimistic update on error
      setOptimisticLiked(!optimisticLiked);
      setOptimisticLikes((prev) => (optimisticLiked ? prev + 1 : prev - 1));
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
      setIsCommentDeleteDialogOpen(false);
      toast.success("Comment deleted successfully.");
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
      setIsShareDialogOpen(false);
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
      setIsEditDialogOpen(false);
      toast.success("Comment updated successfully.");
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
      queryClient.invalidateQueries({ queryKey: ["project"] });
    },
    onError: () => {
      toast.error("Failed to delete update. Please try again.");
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(update.id, {
      onSuccess: () => {
        setIsDeleteDialogOpen(false);
        queryClient.invalidateQueries({ queryKey: ["project"] });
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
        setIsDeleteCardDialogOpen(false);
        queryClient.invalidateQueries({ queryKey: ["project"] });
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
      setNewComment("");
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
          setIsEditDialogOpen(false);
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
      <Card 
        ref={cardRef}
        className="my-6 overflow-hidden rounded-xl border border-none bg-card shadow-md transition-all duration-300 hover:shadow-xl dark:bg-black"
      >
        <div className="flex flex-col">
          <CardContent className="p-0">
            {/* Image Section */}
            <div className="relative h-56 w-full overflow-hidden sm:h-64 md:h-52">
              <Image
                src={update.image || "/placeholder.svg"}
                alt={update.title}
                width={1000}
                height={1000}
                className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

              {/* Title overlay on image */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="font-geist text-xl font-medium text-white md:text-xl">
                  {update.title}
                </h3>
                <div className="mt-2 flex items-center gap-2">
                  <Badge
                    variant="secondary"
                    className="font-geist bg-white/20 text-white backdrop-blur-sm"
                  >
                    ID: {update.id.substring(0, 6)}
                  </Badge>
                  <span className="text-sm text-white/80">{formattedDate}</span>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-5">
              <p className="font-geist mb-5 text-sm leading-relaxed text-muted-foreground md:text-sm">
                {update.content}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 rounded-full px-4 text-sm transition-colors"
                        onClick={handleLike}
                        disabled={isLikedLoading || likeMutation.isPending}
                      >
                        <motion.div
                          animate={{
                            scale: optimisticLiked ? [1, 1.2, 1] : 1,
                            color: optimisticLiked ? "#ef4444" : "currentColor",
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <Heart
                            className={`h-4 w-4 transition-all ${optimisticLiked ? "fill-rose-500" : ""}`}
                          />
                        </motion.div>
                        <motion.span
                          animate={{
                            scale: optimisticLiked ? [1, 1.1, 1] : 1,
                            color: optimisticLiked ? "#ef4444" : "currentColor",
                          }}
                          transition={{ duration: 0.3 }}
                          className="font-medium"
                        >
                          {optimisticLikes}
                        </motion.span>
                      </motion.button>
                    </TooltipTrigger>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`flex items-center gap-2 rounded-full px-4 text-sm transition-colors ${
                          showComments ? "bg-muted" : ""
                        }`}
                        onClick={handleToggleComments}
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span className="font-medium">
                          {update?.comments.length}
                        </span>
                      </Button>
                    </TooltipTrigger>
                  </Tooltip>
                </div>

                {isOwner && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-white/20"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-44 rounded-xl border shadow-none dark:border-gray-500/5"
                    >
                      <DropdownMenuItem
                        onClick={() => {
                          setProjectUpdate(update);
                          setIsShareDialogOpen(true);
                        }}
                        className="font-geist flex h-11 items-center gap-2 rounded-xl"
                      >
                        <Share className="h-4 w-4" />
                        Share as post
                      </DropdownMenuItem>
                      <Separator className="my-1" />
                      <DropdownMenuItem
                        onClick={() => setIsDeleteCardDialogOpen(true)}
                        className="font-geist flex h-11 items-center gap-2 rounded-xl text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete update
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
            </div>
          </CardContent>

          {/* Comments Section */}
          {showComments && (
            <div className="border-t bg-muted/5 p-5 dark:border-black">
              <div className="mb-4 flex items-center gap-2">
                <Textarea
                  placeholder="Add a comment..."
                  className="min-h-[60px] resize-none rounded-lg border-input bg-background text-sm shadow-sm focus-visible:ring-1 focus-visible:ring-ring"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <Button
                  size="icon"
                  className="h-10 w-10 rounded-full"
                  onClick={handleAddComment}
                  disabled={addCommentMutation.isPending || !newComment.trim()}
                >
                  <Send className="h-4 w-4" />
                  <span className="sr-only">Send comment</span>
                </Button>
              </div>

              {isCommentsLoading ? (
                <div className="flex h-20 items-center justify-center">
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                </div>
              ) : comments.length > 0 ? (
                <div className="space-y-3">
                  {comments.map((comment: commentType) => (
                    <div
                      key={comment.id}
                      className="rounded-lg bg-card p-4 shadow-sm transition-all hover:shadow-md dark:border dark:border-gray-500/10 dark:bg-black"
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8 border shadow-sm">
                          <AvatarFallback className="text-xs">
                            {comment?.user?.name.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                          <AvatarImage src={comment?.user?.image as string} />
                        </Avatar>

                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">
                              {comment?.user?.name}
                            </p>
                            <span className="text-xs text-muted-foreground">
                              {formatDistanceToNow(
                                new Date(comment.createdAt),
                                {
                                  addSuffix: true,
                                },
                              )}
                            </span>
                          </div>

                          <p className="mt-1 text-sm">{comment.content}</p>

                          {comment.user.id === session?.data?.user?.id && (
                            <div className="mt-2 flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 rounded-full p-0"
                                onClick={() =>
                                  handleOpenEditDialog(
                                    comment.id,
                                    comment.content,
                                  )
                                }
                              >
                                <EditIcon className="h-3.5 w-3.5 text-muted-foreground" />
                                <span className="sr-only">Edit</span>
                              </Button>

                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 rounded-full p-0"
                                onClick={() =>
                                  handleOpenDeleteCommentDialog(comment.id)
                                }
                              >
                                <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex h-20 items-center justify-center text-sm text-muted-foreground">
                  No comments yet. Be the first to comment!
                </div>
              )}
            </div>
          )}

          {/* Dialogs */}
          {/* Delete Comment Confirmation Dialog */}
          <Dialog
            open={isCommentDeleteDialogOpen}
            onOpenChange={setIsCommentDeleteDialogOpen}
          >
            <DialogContent className="max-w-md overflow-hidden rounded-xl border-none p-0 backdrop-blur-sm">
              <DialogTitle></DialogTitle>
              <div className="relative flex flex-col">
                {/* Glow effects */}
                <div className="absolute -right-4 size-32 -rotate-45 rounded-full border border-red-300/50 bg-gradient-to-br from-red-300/40 via-red-400/50 to-transparent blur-[150px] backdrop-blur-sm"></div>
                <div className="absolute -bottom-5 left-12 size-32 rotate-45 rounded-full border border-orange-300/50 bg-gradient-to-tl from-orange-300/40 via-orange-400/30 to-transparent blur-[150px] backdrop-blur-sm"></div>

                <div className="flex w-full flex-col px-6 pb-3">
                  <div className="font-geist mb-2 text-3xl font-medium">
                    Delete Comment
                  </div>
                  <p className="font-geist mb-6 text-muted-foreground">
                    Are you sure you want to delete this comment? This action cannot be undone.
                  </p>

                  <div className="font-geist mt-8 flex justify-end gap-3 border-t pt-4 dark:border-gray-500/5">
                    <Button
                      variant="outline"
                      className="h-11 w-24 rounded-2xl"
                      onClick={() => setIsCommentDeleteDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      className="h-11 w-24 rounded-2xl"
                      onClick={() => {
                        if (deletingCommentId) handleDeleteComment(deletingCommentId);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Edit Comment Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-md overflow-hidden rounded-xl border-none p-0 backdrop-blur-sm">
              <DialogTitle></DialogTitle>
              <div className="relative flex flex-col">
                {/* Glow effects */}
                <div className="absolute -right-4 size-32 -rotate-45 rounded-full border border-blue-300/50 bg-gradient-to-br from-blue-300/40 via-blue-400/50 to-transparent blur-[150px] backdrop-blur-sm"></div>
                <div className="absolute -bottom-5 left-12 size-32 rotate-45 rounded-full border border-orange-300/50 bg-gradient-to-tl from-orange-300/40 via-orange-400/30 to-transparent blur-[150px] backdrop-blur-sm"></div>

                <div className="flex w-full flex-col px-6 pb-3">
                  <div className="font-geist mb-2 text-3xl font-medium">
                    Edit Comment
                  </div>
                  <p className="font-geist mb-6 text-muted-foreground">
                    Update your comment below.
                  </p>

                  <div className="space-y-4">
                    <Textarea
                      className="font-geist resize-none rounded-xl border-input/50 shadow-none focus-visible:ring-primary/50 dark:border-gray-500/5"
                      value={editingComment?.content || ""}
                      onChange={(e) =>
                        setEditingComment((prev) =>
                          prev ? { ...prev, content: e.target.value } : prev,
                        )
                      }
                    />
                  </div>

                  <div className="font-geist mt-8 flex justify-end gap-3 border-t pt-4 dark:border-gray-500/5">
                    <Button
                      variant="outline"
                      className="h-11 w-24 rounded-2xl"
                      onClick={() => setIsEditDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="h-11 w-24 rounded-2xl"
                      onClick={() => {
                        if (editingComment) {
                          handleUpdateComment(editingComment.id, editingComment.content);
                        }
                      }}
                    >
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Share Update Dialog */}
          <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
            <DialogContent className="max-w-md overflow-hidden rounded-xl border-none p-0 backdrop-blur-sm">
              <DialogTitle></DialogTitle>
              <div className="relative flex flex-col">
                {/* Glow effects */}
                <div className="absolute -right-4 size-32 -rotate-45 rounded-full border border-blue-300/50 bg-gradient-to-br from-blue-300/40 via-blue-400/50 to-transparent blur-[150px] backdrop-blur-sm"></div>
                <div className="absolute -bottom-5 left-12 size-32 rotate-45 rounded-full border border-orange-300/50 bg-gradient-to-tl from-orange-300/40 via-orange-400/30 to-transparent blur-[150px] backdrop-blur-sm"></div>

                <div className="flex w-full flex-col px-6 pb-3">
                  <div className="font-geist mb-2 text-3xl font-medium">
                    Share Update
                  </div>
                  <p className="font-geist mb-6 text-muted-foreground">
                    Do you want to share this update as a post?
                  </p>

                  <div className="font-geist mt-8 flex justify-end gap-3 border-t pt-4 dark:border-gray-500/5">
                    <Button
                      variant="outline"
                      className="h-11 w-24 rounded-2xl"
                      onClick={() => setIsShareDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="h-11 w-24 rounded-2xl"
                      onClick={async () => {
                        await postAsPostMutation.mutate();
                      }}
                      disabled={postAsPostMutation.isPending}
                    >
                      {postAsPostMutation.isPending ? "Sharing..." : "Share"}
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Delete Card Confirmation Dialog */}
          <Dialog
            open={isDeleteCardDialogOpen}
            onOpenChange={setIsDeleteCardDialogOpen}
          >
            <DialogContent className="max-w-md overflow-hidden rounded-xl border-none p-0 backdrop-blur-sm">
              <DialogTitle></DialogTitle>
              <div className="relative flex flex-col">
                {/* Glow effects */}
                <div className="absolute -right-4 size-32 -rotate-45 rounded-full border border-red-300/50 bg-gradient-to-br from-red-300/40 via-red-400/50 to-transparent blur-[150px] backdrop-blur-sm"></div>
                <div className="absolute -bottom-5 left-12 size-32 rotate-45 rounded-full border border-orange-300/50 bg-gradient-to-tl from-orange-300/40 via-orange-400/30 to-transparent blur-[150px] backdrop-blur-sm"></div>

                <div className="flex w-full flex-col px-6 pb-3">
                  <div className="font-geist mb-2 text-3xl font-medium">
                    Delete Update
                  </div>
                  <p className="font-geist mb-6 text-muted-foreground">
                    Are you sure you want to delete this update? This action cannot be undone.
                  </p>

                  <div className="font-geist mt-8 flex justify-end gap-3 border-t pt-4 dark:border-gray-500/5">
                    <Button
                      variant="outline"
                      className="h-11 w-24 rounded-2xl"
                      onClick={() => setIsDeleteCardDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      className="h-11 w-24 rounded-2xl"
                      onClick={handleDeleteCard}
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending ? "Deleting..." : "Delete"}
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card>
    </TooltipProvider>
  );
}
