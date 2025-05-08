"use client";

import React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { EditProjectDialog } from "@/components/ui/edit-project-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type ProjectInterface from "@/interface/auth/project.interface";
import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/providers/tanstack-query-provider";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import {
  CalendarIcon,
  Check,
  ExternalLink,
  Flag,
  Heart,
  MessageSquare,
  PaintBucket,
  PencilIcon,
  Plus,
  PlusIcon,
  SettingsIcon,
  Share2,
  Star,
  Trash2,
  Trash2Icon,
  Upload,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { GoStar, GoStarFill } from "react-icons/go";
import ProjectDetailSkeleton from "../skeleton/project-detail.skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";
import RecommendedProjects from "../user/recommend-project";
import UpdateCard from "./project-update-card";

const ProjectDetail = ({ projectId }: { projectId: string }) => {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShareUpdateDialogOpen, setIsShareUpdateDialogOpen] = useState(false);
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateContent, setUpdateContent] = useState("");
  const [updateImage, setUpdateImage] = useState<File | null>(null);
  const [isSubmittingUpdate, setIsSubmittingUpdate] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isShareProjectDialogOpen, setIsShareProjectDialogOpen] =
    useState(false);
  const [activeTab, setActiveTab] = useState<"updates" | "reviews">("updates");
  const [reviewContent, setReviewContent] = useState("");
  const [isEditingReview, setIsEditingReview] = useState(false);
  const [editingReviewContent, setEditingReviewContent] = useState("");
  const [editingReviewId, setEditingReviewId] = useState<string | null>(null);
  const [isEditReviewModalOpen, setIsEditReviewModalOpen] = useState(false);
  const [isDeleteReviewModalOpen, setIsDeleteReviewModalOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
  const session = authClient.useSession();

  console.log(isEditingReview);
  useEffect(() => {
    const fetchFollowStatus = async () => {
      try {
        const response = await axios.get(
          `/api/project/follow?projectId=${projectId}`,
        );
        setIsFollowing(response.data.isFollowing);
      } catch (error) {
        console.error("Error fetching follow status:", error);
      }
    };

    fetchFollowStatus();
  }, [projectId]);

  const {
    data: project,
    isLoading,
    error,
  } = useQuery<ProjectInterface>({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const response = await axios.get(`/api/project/${projectId}`);
      return response.data.data;
    },
    enabled: !!projectId,
  });

  const likeMutation = useMutation({
    mutationFn: async () => {
      await axios.post(`/api/project/like?projectId=${projectId}`);
    },
    onMutate: () => {
      // Optimistically update the UI
      setIsLiked((prev) => !prev);
      if (project) {
        const optimisticProject = {
          ...project,
          _count: {
            ...project._count,
            ratings: project._count.ratings + (isLiked ? -1 : 1),
          },
        };
        queryClient.setQueryData(["project", projectId], optimisticProject);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
    onError: () => {
      // Revert optimistic update on error
      setIsLiked((prev) => !prev);
      if (project) {
        const revertedProject = {
          ...project,
          _count: {
            ...project._count,
            ratings: project._count.ratings + (isLiked ? 1 : -1),
          },
        };
        queryClient.setQueryData(["project", projectId], revertedProject);
      }
      toast.error("Failed to update like. Please try again.");
    },
  });

  const handleLikeProject = () => {
    likeMutation.mutate();
  };

  const starMutation = useMutation({
    mutationFn: async () => {
      await axios.post(`/api/project/star`, { projectId });
    },
    onMutate: () => {
      // Optimistically update the UI
      if (project) {
        const optimisticProject = {
          ...project,
          _count: {
            ...project._count,
            stars:
              project._count.stars +
              (project.stars?.some(
                (star) => star.userId === session.data?.user.id,
              )
                ? -1
                : 1),
          },
          stars: project.stars?.some(
            (star) => star.userId === session.data?.user.id,
          )
            ? project.stars.filter(
                (star) => star.userId !== session.data?.user.id,
              )
            : [...(project.stars || []), { userId: session.data?.user.id }],
        };
        queryClient.setQueryData(["project", projectId], optimisticProject);
      }
    },
    onSuccess: () => {
      toast.success("Star status updated!");
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
    onError: () => {
      // Revert optimistic update on error
      if (project) {
        const revertedProject = {
          ...project,
          _count: {
            ...project._count,
            stars:
              project._count.stars +
              (project.stars?.some(
                (star) => star.userId === session.data?.user.id,
              )
                ? 1
                : -1),
          },
          stars: project.stars?.some(
            (star) => star.userId === session.data?.user.id,
          )
            ? [...(project.stars || []), { userId: session.data?.user.id }]
            : project.stars.filter(
                (star) => star.userId !== session.data?.user.id,
              ),
        };
        queryClient.setQueryData(["project", projectId], revertedProject);
      }
      toast.error("Failed to update star status. Please try again.");
    },
  });

  const handleStarProject = () => {
    starMutation.mutate();
  };

  const followMutation = useMutation({
    mutationFn: async () => {
      await axios.post(`/api/project/follow?projectId=${projectId}`);
    },
    onMutate: () => {
      // Optimistically update the UI
      setIsFollowing((prev) => !prev);
      if (project) {
        const optimisticProject = {
          ...project,
          _count: {
            ...project._count,
            followers: project._count.followers + (isFollowing ? -1 : 1),
          },
        };
        queryClient.setQueryData(["project", projectId], optimisticProject);
      }
    },
    onSuccess: () => {
      // Invalidate all relevant queries
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      queryClient.invalidateQueries({ queryKey: ["recommended-projects"] });
      queryClient.invalidateQueries({ queryKey: ["followed-projects"] });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("Follow status updated!");
    },
    onError: () => {
      // Revert optimistic update on error
      setIsFollowing((prev) => !prev);
      if (project) {
        const revertedProject = {
          ...project,
          _count: {
            ...project._count,
            followers: project._count.followers + (isFollowing ? 1 : -1),
          },
        };
        queryClient.setQueryData(["project", projectId], revertedProject);
      }
      toast.error("Failed to update follow status. Please try again.");
    },
  });

  const handleFollowProject = () => {
    followMutation.mutate();
  };

  const postAsPostMutation = useMutation({
    mutationKey: ["postaspost", projectId],
    mutationFn: async () => {
      const response = await axios.post(
        `/api/project/update/share`,
        {
          content:
            project?.userId === session.data?.user.id
              ? "This is my project and I'd like to share it with you"
              : "I saw this project and wanted to share it :)",
          fileUrls: [],
          projectId: projectId,
        },
        { withCredentials: true },
      );

      return response.data.data;
    },
    onSuccess: () => {
      toast.success("Update posted as post");
    },
    onError: () => {
      toast.error("Error occurred while trying to post update as post");
    },
  });

  const updateMutation = useMutation({
    mutationKey: ["update-project"],
    mutationFn: async (updatedProjectData: Partial<ProjectInterface>) => {
      const response = await axios.patch(
        `/api/project?id=${projectId}`,
        updatedProjectData,
      );
      return response.data;
    },
    onSuccess: () => {
      toast.success("Project successfully updated");

      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      setIsEditModalOpen(false);
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } },
    ) => {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while updating the project";
      toast.error(errorMessage);
    },
  });

  const deleteMutation = useMutation({
    mutationKey: ["delete-project"],
    mutationFn: async () => {
      const response = await axios.delete(`/api/project?id=${projectId}`);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Project successfully deleted");
      router.push("/projects");
    },
    onError: (
      error: Error & { response?: { data?: { message?: string } } },
    ) => {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while deleting the project";
      toast.error(errorMessage);
    },
  });

  const handleDeleteProject = async () => {
    await deleteMutation.mutate();
  };

  // const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0];
  //   if (file) {
  //     console.log("Image selected:", file);
  //     setSelectedImage(file);
  //   }
  // };

  // const handleImageCancel = () => {
  //   setSelectedImage(null);
  // };

  const handleEditProject = async (
    updatedProjectData: Partial<ProjectInterface>,
  ) => {
    let imageUrl = project?.image;

    if (selectedImage) {
      const formData = new FormData();
      formData.append("file", selectedImage);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
      );

      try {
        const response = await axios.post(
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL!,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          },
        );
        imageUrl = response.data.secure_url;
      } catch (error) {
        console.error("Image upload failed:", error);
        toast.error("Image upload failed. Please try again.");
        return;
      }
    }

    const finalProjectData = {
      ...updatedProjectData,
      name: updatedProjectData?.name || project?.name,
      description: updatedProjectData?.description || project?.description,
      category: [
        ...new Set([
          ...(project?.category as string[]),
          ...(updatedProjectData?.category || []),
        ]),
      ],
      image: imageUrl,
    };

    await updateMutation.mutate(finalProjectData);
  };

  // const handleDeleteUpdate = (updateId: string) => {
  //   if (project) {
  //     queryClient.setQueryData(["project", projectId], {
  //       ...project,
  //       updates: project.updates.filter((update) => update.id !== updateId),
  //     });
  //   }
  // };

  const handleShareUpdate = async () => {
    if (!updateTitle || !updateContent) {
      toast.error("Title and content are required.");
      return;
    }

    setIsSubmittingUpdate(true);
    let imageUrl = null;

    if (updateImage) {
      const formData = new FormData();
      formData.append("file", updateImage);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
      );

      try {
        const response = await axios.post(
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL!,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          },
        );
        imageUrl = response.data.secure_url;
      } catch (error) {
        console.error("Image upload failed:", error);
        toast.error("Image upload failed. Please try again.");
        setIsSubmittingUpdate(false);
        return;
      }
    }

    try {
      await axios.post(`/api/project/update/${projectId}`, {
        title: updateTitle,
        content: updateContent,
        image: imageUrl,
      });
      toast.success("Update shared successfully!");
      setIsShareUpdateDialogOpen(false);

      setUpdateTitle("");
      setUpdateContent("");
      setUpdateImage(null);
      setIsSubmittingUpdate(false);

      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    } catch (error) {
      console.error("Error sharing update:", error);
      toast.error("Failed to share update. Please try again.");
      setIsSubmittingUpdate(false);
    }
  };

  const handleUpdateImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUpdateImage(file);
    }
  };

  const createReviewMutation = useMutation({
    mutationFn: async () => {
      await axios.post(`/api/project/review`, {
        projectId,
        content: reviewContent,
      });
    },
    onMutate: () => {
      // Optimistically update the UI
      if (project) {
        const optimisticProject = {
          ...project,
          _count: {
            ...project._count,
            reviews: project._count.reviews + 1,
          },
          reviews: [
            ...(project.reviews || []),
            {
              id: "temp-" + Date.now(),
              content: reviewContent,
              createdAt: new Date().toISOString(),
              user: {
                id: session.data?.user.id,
                visualName: session.data?.user.name,
                image: session.data?.user.image,
              },
            },
          ],
        };
        queryClient.setQueryData(["project", projectId], optimisticProject);
      }
    },
    onSuccess: () => {
      toast.success("Review added successfully!");
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      setReviewContent("");
    },
    onError: () => {
      // Revert optimistic update on error
      if (project) {
        const revertedProject = {
          ...project,
          _count: {
            ...project._count,
            reviews: project._count.reviews - 1,
          },
          reviews: project.reviews?.filter(
            (review) => !review.id.startsWith("temp-"),
          ),
        };
        queryClient.setQueryData(["project", projectId], revertedProject);
      }
      toast.error("Failed to add review. Please try again.");
    },
  });

  const editReviewMutation = useMutation({
    mutationFn: async ({
      reviewId,
      content,
    }: {
      reviewId: string;
      content: string;
    }) => {
      await axios.put(`/api/project/review`, { reviewId, content });
    },
    onMutate: ({ reviewId, content }) => {
      // Optimistically update the UI
      if (project) {
        const optimisticProject = {
          ...project,
          reviews: project.reviews?.map((review) =>
            review.id === reviewId ? { ...review, content } : review,
          ),
        };
        queryClient.setQueryData(["project", projectId], optimisticProject);
      }
    },
    onSuccess: () => {
      toast.success("Review updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      setIsEditingReview(false);
      setEditingReviewId(null);
      setEditingReviewContent("");
    },
    onError: () => {
      // Revert optimistic update on error
      if (project) {
        const revertedProject = {
          ...project,
          reviews: project.reviews?.map((review) =>
            review.id === editingReviewId
              ? { ...review, content: editingReviewContent }
              : review,
          ),
        };
        queryClient.setQueryData(["project", projectId], revertedProject);
      }
      toast.error("Failed to update review. Please try again.");
    },
  });

  const deleteReviewMutation = useMutation({
    mutationFn: async (reviewId: string) => {
      await axios.delete(`/api/project/review`, {
        data: { reviewId },
      });
    },
    onMutate: (reviewId) => {
      // Optimistically update the UI
      if (project) {
        const optimisticProject = {
          ...project,
          _count: {
            ...project._count,
            reviews: project._count.reviews - 1,
          },
          reviews: project.reviews?.filter((review) => review.id !== reviewId),
        };
        queryClient.setQueryData(["project", projectId], optimisticProject);
      }
    },
    onSuccess: () => {
      toast.success("Review deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
    onError: () => {
      // Revert optimistic update on error
      if (project) {
        const revertedProject = {
          ...project,
          _count: {
            ...project._count,
            reviews: project._count.reviews + 1,
          },
          reviews: [
            ...(project.reviews || []),
            project.reviews?.find((review) => review.id === reviewToDelete),
          ].filter(Boolean),
        };
        queryClient.setQueryData(["project", projectId], revertedProject);
      }
      toast.error("Failed to delete review. Please try again.");
    },
  });

  const handleCreateReview = () => {
    if (!reviewContent.trim()) {
      toast.error("Review content cannot be empty.");
      return;
    }
    createReviewMutation.mutate();
  };

  const handleEditReview = (reviewId: string, content: string) => {
    setEditingReviewId(reviewId);
    setEditingReviewContent(content);
    setIsEditReviewModalOpen(true);
  };

  const handleSaveEditedReview = () => {
    if (!editingReviewContent.trim()) {
      toast.error("Review content cannot be empty.");
      return;
    }

    if (editingReviewId) {
      editReviewMutation.mutate({
        reviewId: editingReviewId,
        content: editingReviewContent,
      });
    } else {
      toast.error("Review ID is missing");
    }
  };

  const handleDeleteReview = (reviewId: string) => {
    setReviewToDelete(reviewId);
    setIsDeleteReviewModalOpen(true);
  };

  const ReviewEditModal = React.memo(() => {
    const [localContent, setLocalContent] = useState(editingReviewContent);

    useEffect(() => {
      setLocalContent(editingReviewContent);
    }, []);

    const handleSave = () => {
      setEditingReviewContent(localContent);
      handleSaveEditedReview();
      setIsEditReviewModalOpen(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setLocalContent(e.target.value);
      setEditingReviewContent(e.target.value);
    };

    return (
      <Dialog
        open={isEditReviewModalOpen}
        onOpenChange={setIsEditReviewModalOpen}
      >
        <DialogContent className="backdrop-blur-sm p-0 border-none rounded-xl max-w-md overflow-hidden">
          <DialogTitle></DialogTitle>
          <div className="relative flex flex-col">
            {/* Glow effects */}
            <div className="-right-4 absolute bg-gradient-to-br from-primary/40 via-primary/50 to-transparent backdrop-blur-sm blur-[150px] border border-primary/50 rounded-full size-32 -rotate-45"></div>
            <div className="-bottom-5 left-12 absolute bg-gradient-to-tl from-secondary/40 via-secondary/30 to-transparent backdrop-blur-sm blur-[150px] border border-secondary/50 rounded-full size-32 rotate-45"></div>

            <div className="flex flex-col px-6 pb-3 w-full">
              <div className="mb-2 font-geist font-medium text-3xl">
                Edit Review
              </div>
              <Textarea
                value={localContent}
                onChange={handleChange}
                className="bg-background/50 shadow-sm backdrop-blur-sm border-none rounded-xl focus-visible:ring-1 focus-visible:ring-ring min-h-[120px]"
                placeholder="Edit your review..."
              />

              <div className="flex justify-end gap-3 mt-8 pt-4 dark:border-gray-500/5 border-t font-geist">
                <Button
                  variant="outline"
                  className="rounded-2xl w-24 h-11"
                  onClick={() => setIsEditReviewModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="rounded-2xl w-24 h-11"
                  onClick={handleSave}
                  disabled={editReviewMutation.isPending}
                >
                  {editReviewMutation.isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  });

  ReviewEditModal.displayName = "ReviewEditModal";

  const DeleteReviewModal = () => {
    return (
      <Dialog
        open={isDeleteReviewModalOpen}
        onOpenChange={setIsDeleteReviewModalOpen}
      >
        <DialogContent className="backdrop-blur-sm p-0 border-none rounded-xl max-w-md overflow-hidden">
          <DialogTitle></DialogTitle>
          <div className="relative flex flex-col">
            {/* Glow effects */}
            <div className="-right-4 absolute bg-gradient-to-br from-red-300/40 via-red-400/50 to-transparent backdrop-blur-sm blur-[150px] border border-red-300/50 rounded-full size-32 -rotate-45"></div>
            <div className="-bottom-5 left-12 absolute bg-gradient-to-tl from-orange-300/40 via-orange-400/30 to-transparent backdrop-blur-sm blur-[150px] border border-orange-300/50 rounded-full size-32 rotate-45"></div>

            <div className="flex flex-col px-6 pb-3 w-full">
              <div className="mb-2 font-geist font-medium text-3xl">
                Delete Review
              </div>
              <p className="mb-6 font-geist text-muted-foreground">
                Are you sure you want to delete this review? This action cannot
                be undone.
              </p>

              <div className="flex justify-end gap-3 mt-8 pt-4 dark:border-gray-500/5 border-t font-geist">
                <Button
                  variant="outline"
                  className="rounded-2xl w-24 h-11"
                  onClick={() => setIsDeleteReviewModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="rounded-2xl w-24 h-11"
                  onClick={() => {
                    if (reviewToDelete) {
                      deleteReviewMutation.mutate(reviewToDelete);
                      setIsDeleteReviewModalOpen(false);
                      setReviewToDelete(null);
                    }
                  }}
                  disabled={deleteReviewMutation.isPending}
                >
                  {deleteReviewMutation.isPending ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  };

  if (isLoading) {
    return <ProjectDetailSkeleton />;
  }

  if (error) return <div>Error loading project data</div>;

  const createdDate = new Date(project?.createdAt || Date.now());
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });

  const isUserAuthor = session.data?.user.id === project?.userId;

  return (
    <div className="relative mx-auto pb-8 container">
      <div className="hidden md:block -top-20 -right-10 absolute bg-gradient-to-br from-amber-300/10 dark:from-orange-300/10 to-transparent blur-[80px] rounded-full w-[300px] h-[300px] -rotate-45"></div>

      <div className="group relative shadow-lg mx-auto mb-12 rounded-2xl w-[94%] md:w-full h-[400px] md:h-[300px] overflow-hidden">
        <Image
          src={project?.image || "/placeholder.svg"}
          alt={(project?.name as string) || ""}
          fill
          quality={100}
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          priority={true}
        />
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-zinc-900/90 dark:from-black/80 via-zinc-900/60 dark:via-black/50 to-transparent p-8">
          <div className="right-0 bottom-0 left-0 absolute bg-gradient-to-t from-zinc-900/90 dark:from-black to-transparent h-32"></div>
          <div className="z-10 relative flex items-center gap-3 mb-4">
            <Badge
              variant="outline"
              className="bg-primary/10 backdrop-blur-sm px-3 border-primary/30 rounded-full h-8 font-geist font-normal text-white text-xs"
            >
              {project?.status}
            </Badge>
            <Badge
              variant="outline"
              className="bg-secondary/20 backdrop-blur-sm px-3 border-secondary/30 rounded-full h-8 font-geist font-normal text-secondary-foreground"
            >
              {project?.access}
            </Badge>
          </div>
          <h1 className="z-10 relative mb-4 font-geist font-semibold text-white text-4xl md:text-5xl">
            {project?.name}
          </h1>
          <div className="z-10 relative flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="relative rounded-full ring-2 ring-white/20 w-10 h-10 overflow-hidden">
                <Image
                  src={project?.user.image || "/placeholder.svg"}
                  alt={project?.user.visualName as string}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-geist font-medium text-white">
                {project?.user.visualName}
              </span>
            </div>
            <div className="flex items-center font-geist font-normal text-white/80 text-sm">
              <CalendarIcon className="mr-2 w-4 h-4" />
              <span>{timeAgo}</span>
            </div>
          </div>
          {project?.user.id === session.data?.user.id && (
            <div className="top-6 right-6 absolute">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full w-9 h-9 text-white"
                  >
                    <SettingsIcon className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="shadow-none border dark:border-gray-500/5 rounded-xl w-44"
                >
                  <DropdownMenuItem
                    className="flex items-center gap-2 rounded-xl h-11 font-geist"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    <PencilIcon className="w-4 h-4" />
                    Edit Project
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="flex items-center gap-2 rounded-xl h-11 font-geist text-red-600 focus:text-red-600"
                  >
                    <Trash2Icon className="w-4 h-4" />
                    Delete Project
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>

      <div className="gap-8 grid grid-cols-1 lg:grid-cols-3 mx-auto w-[94%] md:w-full">
        <div className="space-y-8 lg:col-span-2">
          <div className="flex flex-wrap gap-2">
            {project?.category.map((cat: string) => (
              <Badge
                key={cat}
                variant="outline"
                className="bg-background/50 backdrop-blur-sm px-3 border-border/40 rounded-full h-8 font-geist font-normal text-sm"
              >
                {cat}
              </Badge>
            ))}
          </div>

          {/* Description */}
          <Card className="bg-white dark:bg-card/50 shadow-sm border border-gray-100 dark:border-gray-500/5 rounded-xl overflow-hidden">
            <CardContent className="p-8">
              <h2 className="mb-6 font-geist font-medium text-foreground text-4xl">
                About this project
              </h2>
              <p className="font-geist font-normal text-muted-foreground text-sm leading-relaxed">
                {project?.description}
              </p>
            </CardContent>
          </Card>

          {/* Mobile Creator and Star Cards - Only visible on mobile */}
          <div className="lg:hidden space-y-4">
            {/* Creator Profile */}
            <Card className="bg-white dark:bg-card/50 shadow-sm border border-gray-100 dark:border-gray-500/5 rounded-xl overflow-hidden">
              <CardContent className="p-4">
                <h2 className="mb-4 font-geist font-normal text-xl text-center">
                  Creator
                </h2>
                <div className="flex items-center gap-4">
                  <div className="relative rounded-full ring-2 ring-primary/20 w-16 h-16 overflow-hidden">
                    <Image
                      src={project?.user.image || "/placeholder.svg"}
                      alt={(project?.user.visualName as string) || ""}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-geist font-normal text-lg">
                      {project?.user.visualName}
                    </h3>
                    <span className="font-geist font-normal text-muted-foreground text-sm">
                      Nerd at: {project?.user.nerdAt}
                    </span>
                    <p className="font-geist font-normal text-muted-foreground text-sm line-clamp-2">
                      {project?.user.bio}
                    </p>
                    <Link
                      href={`/user-profile/${project?.userId}`}
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 mt-2 text-primary text-sm hover:underline"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Connect
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Star and Follow Card */}
            <Card className="bg-white dark:bg-card/50 shadow-sm border border-gray-100 dark:border-gray-500/5 rounded-xl overflow-hidden">
              <CardContent className="p-4">
                <div className="flex flex-col gap-2">
                  <Button
                    variant="outline"
                    className="gap-2 bg-white/5 hover:bg-white/10 dark:bg-black/5 dark:hover:bg-black/10 backdrop-blur-sm border-zinc-200/20 dark:border-zinc-800/20 rounded-full w-full h-11 font-medium text-zinc-900 dark:text-zinc-100 text-sm transition-colors"
                    onClick={handleStarProject}
                  >
                    {project?.stars?.some(
                      (each) => each.userId === session.data?.user.id,
                    ) ? (
                      <GoStarFill className="w-4 h-4 text-yellow-500" />
                    ) : (
                      <GoStar className="w-4 h-4" />
                    )}
                    {project?.stars?.some(
                      (each) => each.userId === session.data?.user.id,
                    )
                      ? "Remove Star"
                      : "Star Project"}
                  </Button>

                  {!isUserAuthor && (
                    <Button
                      variant={isFollowing ? "outline" : "default"}
                      className={`h-11 w-full gap-2 rounded-full text-sm font-medium dark:text-black ${
                        isFollowing
                          ? "border-gray-100 bg-white text-gray-900 hover:bg-gray-50 dark:border-gray-500/5 dark:bg-card/50 dark:text-gray-100"
                          : "bg-primary text-white hover:bg-primary/90"
                      }`}
                      onClick={handleFollowProject}
                    >
                      {isFollowing ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Following</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>Follow</span>
                        </>
                      )}
                    </Button>
                  )}

                  <Button
                    onClick={() => setIsShareProjectDialogOpen(true)}
                    variant="outline"
                    className="gap-2 bg-white dark:bg-card/50 border-gray-100 dark:border-gray-500/5 rounded-full w-full h-11 font-medium text-gray-900 dark:text-gray-100 text-sm"
                  >
                    <Share2 className="w-4 h-4" />
                    Share project
                  </Button>

                  {isUserAuthor && (
                    <Button
                      variant="outline"
                      className="gap-2 bg-white dark:bg-card/50 border-gray-100 dark:border-gray-500/5 rounded-full w-full h-11 font-medium text-gray-900 dark:text-gray-100 text-sm"
                      onClick={() => setIsShareUpdateDialogOpen(true)}
                    >
                      <PlusIcon className="w-4 h-4" />
                      Share Update
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats */}
          <Card className="bg-white dark:bg-card/50 shadow-sm border border-gray-100 dark:border-gray-500/5 rounded-xl overflow-hidden">
            <CardContent className="p-8">
              <h2 className="mb-6 font-geist font-normal text-foreground text-3xl">
                Project Stats
              </h2>
              <div className="gap-6 grid grid-cols-2 md:grid-cols-5 text-center">
                <div className="flex flex-col items-center">
                  <div className="flex justify-center items-center bg-white dark:bg-card/50 mb-2 border border-gray-100 dark:border-gray-500/5 rounded-full w-10 h-10">
                    <Star className="w-4 h-4 text-foreground" />
                  </div>
                  <span className="font-geist font-normal text-lg">
                    {project?._count.stars}
                  </span>
                  <span className="font-geist font-normal text-muted-foreground text-xs">
                    Stars
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex justify-center items-center bg-white dark:bg-card/50 mb-2 border border-gray-100 dark:border-gray-500/5 rounded-full w-10 h-10">
                    <Heart
                      className="w-4 h-4 text-foreground cursor-pointer"
                      onClick={handleLikeProject}
                    />
                  </div>
                  <span className="font-geist font-normal text-lg">
                    {project?._count.followers}
                  </span>
                  <span className="font-geist font-normal text-muted-foreground text-xs">
                    Followers
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex justify-center items-center bg-white dark:bg-card/50 mb-2 border border-gray-100 dark:border-gray-500/5 rounded-full w-10 h-10">
                    <MessageSquare className="w-4 h-4 text-foreground" />
                  </div>
                  <span className="font-geist font-normal text-lg">
                    {project?._count.reviews}
                  </span>
                  <span className="font-geist font-normal text-muted-foreground text-xs">
                    Reviews
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex justify-center items-center bg-white dark:bg-card/50 mb-2 border border-gray-100 dark:border-gray-500/5 rounded-full w-10 h-10">
                    <Flag className="w-4 h-4 text-foreground" />
                  </div>
                  <span className="font-geist font-normal text-lg">
                    {project?._count?.updates as number}
                  </span>
                  <span className="font-geist font-normal text-muted-foreground text-xs">
                    Updates
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="flex justify-center items-center bg-white dark:bg-card/50 mb-2 border border-gray-100 dark:border-gray-500/5 rounded-full w-10 h-10">
                    <Star className="w-4 h-4 text-foreground" />
                  </div>
                  <span className="font-geist font-normal text-lg">
                    {project?._count?.ratings as number}
                  </span>
                  <span className="font-geist font-normal text-muted-foreground text-xs">
                    Ratings
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Updates and Reviews Section */}
          <Card className="bg-white dark:bg-card/50 shadow-sm border border-gray-100 dark:border-gray-500/5 rounded-xl overflow-hidden">
            <CardContent className="p-4 md:p-8">
              <h2 className="mb-6 font-geist font-normal text-foreground text-3xl">
                Project Activity
              </h2>

              <div className="w-full">
                {/* Custom Tab Headers */}
                <div className="flex bg-white dark:bg-card/50 mb-8 p-1 border border-gray-100 dark:border-gray-500/5 rounded-full w-full overflow-hidden">
                  <button
                    onClick={() => setActiveTab("updates")}
                    className={`relative flex-1 rounded-full py-2.5 text-sm font-medium transition-all duration-300 ${
                      activeTab === "updates"
                        ? "text-white"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    {activeTab === "updates" && (
                      <span className="absolute inset-0 bg-primary dark:bg-secondary shadow-lg rounded-full transition-all duration-300"></span>
                    )}
                    <span className="z-10 relative flex justify-center items-center gap-2">
                      <Flag className="w-4 h-4" />
                      Updates
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab("reviews")}
                    className={`relative flex-1 rounded-full py-2.5 text-sm font-medium transition-all duration-300 ${
                      activeTab === "reviews"
                        ? "text-white"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    {activeTab === "reviews" && (
                      <span className="absolute inset-0 bg-primary dark:bg-secondary shadow-lg rounded-full transition-all duration-300"></span>
                    )}
                    <span className="z-10 relative flex justify-center items-center gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Reviews
                    </span>
                  </button>
                </div>

                {/* Tab Content */}
                <div className="relative">
                  {/* Updates Tab Content */}
                  <div
                    className={`transition-all duration-300 ${
                      activeTab === "updates"
                        ? "opacity-100"
                        : "pointer-events-none absolute inset-0 opacity-0"
                    }`}
                  >
                    {project?.updates && project.updates.length > 0 ? (
                      <div className="space-y-6">
                        {project.updates.map((update, index) => (
                          <UpdateCard
                            update={update}
                            key={index}
                            isOwner={project?.user.id === session.data?.user.id}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col justify-center items-center bg-white dark:bg-card/50 py-12 rounded-xl text-center">
                        <div className="flex justify-center items-center bg-gradient-to-br from-violet-500/10 to-indigo-500/10 mb-6 rounded-full w-20 h-20">
                          <PaintBucket className="w-10 h-10 text-indigo-500" />
                        </div>
                        <h3 className="mb-2 font-normal text-xl">
                          No updates yet
                        </h3>
                        <p className="max-w-md text-gray-500 dark:text-gray-400">
                          This project hasn&apos;t posted any updates. Check
                          back later for progress on this mission to Mars.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Reviews Tab Content */}
                  <div
                    className={`transition-all duration-300 ${
                      activeTab === "reviews"
                        ? "opacity-100"
                        : "pointer-events-none absolute inset-0 opacity-0"
                    }`}
                  >
                    <div className="flex-col items-center space-y-4 mx-auto mb-8">
                      <Textarea
                        placeholder="Write your review here..."
                        value={reviewContent}
                        onChange={(e) => setReviewContent(e.target.value)}
                        className="bg-white dark:bg-card/50 p-4 border border-gray-100 dark:border-gray-500/5 rounded-xl w-full min-h-[120px] text-sm"
                      />
                      <Button
                        onClick={handleCreateReview}
                        disabled={createReviewMutation.isPending}
                        className="right-0 justify-end bg-primary dark:bg-transparent hover:opacity-90 disabled:opacity-50 shadow-none mx-auto border dark:border-gray-700/10 rounded-full w-fit h-12 font-medium text-white transition-opacity"
                      >
                        <span className="py-1 text-white">
                          {createReviewMutation.isPending
                            ? "Submitting..."
                            : "Submit Review"}
                        </span>
                      </Button>
                    </div>

                    {project?.reviews && project.reviews.length > 0 ? (
                      <div className="space-y-6">
                        {project.reviews.map((review, index) => (
                          <div
                            key={index}
                            className="group relative bg-white dark:bg-card/50 p-6 border border-gray-100 dark:border-gray-500/5 rounded-xl overflow-hidden"
                          >
                            <div className="flex items-start gap-4">
                              <div className="relative rounded-full ring-1 ring-white/10 w-10 h-10 overflow-hidden">
                                <Image
                                  src={review.user.image || "/placeholder.svg"}
                                  alt={review.user.visualName as string}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="flex justify-between items-center mb-2">
                                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                    {review.user.visualName}
                                  </h4>
                                  <span className="text-gray-500 dark:text-gray-400 text-xs">
                                    {formatDistanceToNow(
                                      new Date(review.createdAt as string),
                                      {
                                        addSuffix: true,
                                      },
                                    )}
                                  </span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                                  {review.content}
                                </p>
                                {review.user.id === session.data?.user.id && (
                                  <div className="right-4 bottom-4 absolute flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                      onClick={() =>
                                        handleEditReview(
                                          review.id as string,
                                          review.content as string,
                                        )
                                      }
                                      variant="ghost"
                                      size="icon"
                                      className="rounded-full w-8 h-8 text-primary hover:text-primary/80"
                                    >
                                      <PencilIcon className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      onClick={() =>
                                        handleDeleteReview(review.id as string)
                                      }
                                      variant="ghost"
                                      size="icon"
                                      className="rounded-full w-8 h-8 text-destructive hover:text-destructive"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col justify-center items-center bg-white dark:bg-card/50 py-12 rounded-xl text-center">
                        <div className="flex justify-center items-center bg-gradient-to-br from-violet-500/10 to-indigo-500/10 mb-6 rounded-full w-20 h-20">
                          <MessageSquare className="w-10 h-10 text-indigo-500" />
                        </div>
                        <h3 className="mb-2 font-normal text-gray-900 dark:text-gray-100 text-xl">
                          No reviews yet
                        </h3>
                        <p className="max-w-md text-gray-500 dark:text-gray-400">
                          Be the first to share your thoughts about this
                          project!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar - Only visible on desktop */}
        <div className="hidden lg:block space-y-8">
          <Card className="bg-white dark:bg-card/50 shadow-sm border border-gray-100 dark:border-gray-500/5 rounded-xl overflow-hidden">
            <CardContent className="space-y-3 p-4">
              <Button
                variant="outline"
                className="gap-2 bg-white/5 hover:bg-white/10 dark:bg-black/5 dark:hover:bg-black/10 backdrop-blur-sm border-zinc-200/20 dark:border-zinc-800/20 rounded-full w-full h-11 font-medium text-zinc-900 dark:text-zinc-100 text-sm transition-colors"
                onClick={handleStarProject}
              >
                {project?.stars?.some(
                  (each) => each.userId === session.data?.user.id,
                ) ? (
                  <GoStarFill className="w-4 h-4 text-yellow-500" />
                ) : (
                  <GoStar className="w-4 h-4" />
                )}
                {project?.stars?.some(
                  (each) => each.userId === session.data?.user.id,
                )
                  ? "Remove Star"
                  : "Star Project"}
              </Button>

              {!isUserAuthor && (
                <Button
                  variant={isFollowing ? "outline" : "default"}
                  className={`h-11 w-full gap-2 rounded-full text-sm font-medium dark:text-black ${
                    isFollowing
                      ? "border-gray-100 bg-white text-gray-900 hover:bg-gray-50 dark:border-gray-500/5 dark:bg-card/50 dark:text-gray-100"
                      : "bg-primary text-white hover:bg-primary/90"
                  }`}
                  onClick={handleFollowProject}
                >
                  {isFollowing ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span>Follow</span>
                    </>
                  )}
                </Button>
              )}

              <Button
                onClick={() => setIsShareProjectDialogOpen(true)}
                variant="outline"
                className="gap-2 bg-white dark:bg-card/50 border-gray-100 dark:border-gray-500/5 rounded-full w-full h-11 font-medium text-gray-900 dark:text-gray-100 text-sm"
              >
                <Share2 className="w-4 h-4" />
                Share project
              </Button>

              {isUserAuthor && (
                <Button
                  variant="outline"
                  className="gap-2 bg-white dark:bg-card/50 border-gray-100 dark:border-gray-500/5 rounded-full w-full h-11 font-medium text-gray-900 dark:text-gray-100 text-sm"
                  onClick={() => setIsShareUpdateDialogOpen(true)}
                >
                  <PlusIcon className="w-4 h-4" />
                  Share Update
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Creator Profile */}
          <Card className="bg-white dark:bg-card/50 shadow-sm border border-gray-100 dark:border-gray-500/5 rounded-xl overflow-hidden">
            <CardContent className="px-6 py-6">
              <h2 className="mb-4 font-geist font-normal text-xl text-center">
                Creator
              </h2>
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4 rounded-full ring-2 ring-primary/20 w-24 h-24 overflow-hidden">
                  <Image
                    src={project?.user.image || "/placeholder.svg"}
                    alt={(project?.user.visualName as string) || ""}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-geist font-normal text-lg">
                  {project?.user.visualName}
                </h3>
                <span className="mb-2 font-geist font-normal text-muted-foreground text-sm">
                  Nerd at: {project?.user.nerdAt}
                </span>
                <p className="mb-2 font-geist font-normal text-muted-foreground text-sm">
                  {project?.user.bio}
                </p>
                <Separator className="mb-2" />
                <Link
                  href={`/user-profile/${project?.userId}`}
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-primary text-sm hover:underline"
                >
                  <ExternalLink className="w-4 h-4" />
                  Connect with {project?.user.visualName}
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Similar Projects */}
          <RecommendedProjects />
        </div>
      </div>

      <EditProjectDialog
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
        project={project as ProjectInterface}
        isOpen={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSave={handleEditProject}
      />

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent className="backdrop-blur-sm p-0 border-none rounded-xl max-w-md overflow-hidden">
          <DialogTitle></DialogTitle>
          <div className="relative flex flex-col">
            {/* Glow effects */}
            <div className="-right-4 absolute bg-gradient-to-br from-red-300/40 via-red-400/50 to-transparent backdrop-blur-sm blur-[150px] border border-red-300/50 rounded-full size-32 -rotate-45"></div>
            <div className="-bottom-5 left-12 absolute bg-gradient-to-tl from-orange-300/40 via-orange-400/30 to-transparent backdrop-blur-sm blur-[150px] border border-orange-300/50 rounded-full size-32 rotate-45"></div>

            <div className="flex flex-col px-6 pb-3 w-full">
              <div className="mb-2 font-geist font-medium text-3xl">
                Delete Project
              </div>
              <p className="mb-6 font-geist text-muted-foreground">
                Are you sure you want to delete this project? This action cannot
                be undone.
              </p>

              <div className="flex justify-end gap-3 mt-8 pt-4 dark:border-gray-500/5 border-t font-geist">
                <Button
                  variant="outline"
                  className="rounded-2xl w-24 h-11"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteProject}
                  className="bg-red-600 hover:bg-red-600 rounded-2xl w-24 h-11 text-white"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Update Dialog */}
      <Dialog
        open={isShareUpdateDialogOpen}
        onOpenChange={setIsShareUpdateDialogOpen}
      >
        <DialogTitle></DialogTitle>
        <DialogContent className="backdrop-blur-sm p-0 border-none rounded-xl max-w-4xl overflow-hidden">
          <div className="relative flex md:flex-row flex-col h-[85vh] max-h-[85vh]">
            {/* Glow effects */}
            <div className="hidden md:block -right-4 absolute bg-gradient-to-br from-blue-300/40 via-blue-400/50 to-transparent backdrop-blur-sm blur-[150px] border border-blue-300/50 rounded-full size-32 -rotate-45"></div>
            <div className="hidden md:block -bottom-5 left-12 absolute bg-gradient-to-tl from-orange-300/40 via-orange-400/30 to-transparent backdrop-blur-sm blur-[150px] border border-orange-300/50 rounded-full size-32 rotate-45"></div>

            {/* Left Column */}
            <div className="flex flex-col dark:bg-black p-6 dark:border-gray-600/10 border-t border-r border-b border-l rounded-l-xl w-full md:w-1/3">
              <div className="mb-2 font-geist font-medium text-3xl">
                Share Update
              </div>
              <p className="mb-6 font-geist text-muted-foreground">
                Share a new update about your project&apos;s progress
              </p>

              <div className="flex flex-col flex-1 justify-center items-center mt-4">
                <div className="relative bg-black mb-4 border-2 border-primary/20 border-dashed rounded-xl w-full max-w-[220px] aspect-square overflow-hidden">
                  {updateImage ? (
                    <Image
                      src={
                        URL.createObjectURL(updateImage) || "/placeholder.svg"
                      }
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex justify-center items-center w-full h-full font-geist text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>

                <div className="relative w-full max-w-[220px]">
                  <Button
                    className="rounded-full w-full h-11 font-geist b"
                    type="button"
                  >
                    <Upload className="mr-2 w-4 h-4" />
                    {updateImage ? "Change Image" : "Upload Image"}
                  </Button>
                  <Input
                    type="file"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    accept="image/*"
                    onChange={handleUpdateImageChange}
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-6">
                <div className="bg-card shadow-none p-4 border border-gray-100 dark:border-gray-500/5 rounded-xl">
                  <h3 className="mb-4 font-geist font-medium text-lg">
                    Update Details
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="title"
                        className="font-geist font-medium text-sm"
                      >
                        Title
                      </Label>
                      <Input
                        id="title"
                        value={updateTitle}
                        onChange={(e) => setUpdateTitle(e.target.value)}
                        placeholder="Enter update title"
                        className="shadow-none border-input/50 dark:border-gray-500/5 rounded-xl focus-visible:ring-primary/50 h-11 font-geist"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="content"
                        className="font-geist font-medium text-sm"
                      >
                        Content
                      </Label>
                      <Textarea
                        id="content"
                        value={updateContent}
                        onChange={(e) => setUpdateContent(e.target.value)}
                        placeholder="Share your progress..."
                        rows={6}
                        className="shadow-none border-input/50 dark:border-gray-500/5 rounded-xl focus-visible:ring-primary/50 font-geist resize-none"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-8 pt-4 dark:border-gray-500/5 border-t font-geist">
                <Button
                  variant="outline"
                  className="rounded-2xl w-24 h-11"
                  onClick={() => setIsShareUpdateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleShareUpdate}
                  className="gap-2 rounded-2xl w-fit h-11"
                  disabled={isSubmittingUpdate}
                >
                  {isSubmittingUpdate ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Sharing...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      Share Update
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Share Project Dialog */}
      <Dialog
        open={isShareProjectDialogOpen}
        onOpenChange={setIsShareProjectDialogOpen}
      >
        <DialogContent className="backdrop-blur-sm p-0 border-none rounded-xl max-w-md overflow-hidden">
          <DialogTitle></DialogTitle>
          <div className="relative flex flex-col">
            {/* Glow effects */}
            <div className="-right-4 absolute bg-gradient-to-br from-primary/40 via-primary/50 to-transparent backdrop-blur-sm blur-[150px] border border-primary/50 rounded-full size-32 -rotate-45"></div>
            <div className="-bottom-5 left-12 absolute bg-gradient-to-tl from-secondary/40 via-secondary/30 to-transparent backdrop-blur-sm blur-[150px] border border-secondary/50 rounded-full size-32 rotate-45"></div>

            <div className="flex flex-col px-6 pb-3 w-full">
              <div className="mb-2 font-geist font-medium text-3xl">
                Share Project
              </div>
              <p className="font-geist text-muted-foreground text-sm">
                Share this project as a post to let others discover it. This
                will create a new post featuring your project.
              </p>

              <div className="flex justify-end gap-3 mt-8 pt-4 dark:border-gray-500/5 border-t font-geist">
                <Button
                  variant="outline"
                  className="rounded-2xl w-24 h-11"
                  onClick={() => setIsShareProjectDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    await postAsPostMutation.mutate();
                    setIsShareProjectDialogOpen(false);
                  }}
                  className="gap-2 rounded-2xl w-fit h-11"
                >
                  <Share2 className="w-4 h-4" />
                  Share as Post
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ReviewEditModal />
      <DeleteReviewModal />
    </div>
  );
};

export default ProjectDetail;
