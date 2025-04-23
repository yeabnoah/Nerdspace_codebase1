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
      await axios.post(`/api/project/star?projectId=${projectId}`);
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
        <DialogContent className="max-w-md overflow-hidden rounded-xl border-none p-0 backdrop-blur-sm">
          <DialogTitle></DialogTitle>
          <div className="relative flex flex-col">
            {/* Glow effects */}
            <div className="absolute -right-4 size-32 -rotate-45 rounded-full border border-primary/50 bg-gradient-to-br from-primary/40 via-primary/50 to-transparent blur-[150px] backdrop-blur-sm"></div>
            <div className="absolute -bottom-5 left-12 size-32 rotate-45 rounded-full border border-secondary/50 bg-gradient-to-tl from-secondary/40 via-secondary/30 to-transparent blur-[150px] backdrop-blur-sm"></div>

            <div className="flex w-full flex-col px-6 pb-3">
              <div className="mb-2 font-geist text-3xl font-medium">
                Edit Review
              </div>
              <Textarea
                value={localContent}
                onChange={handleChange}
                className="min-h-[120px] rounded-xl border-none bg-background/50 shadow-sm backdrop-blur-sm focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Edit your review..."
              />

              <div className="mt-8 flex justify-end gap-3 border-t pt-4 font-geist dark:border-gray-500/5">
                <Button
                  variant="outline"
                  className="h-11 w-24 rounded-2xl"
                  onClick={() => setIsEditReviewModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="h-11 w-24 rounded-2xl"
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
        <DialogContent className="max-w-md overflow-hidden rounded-xl border-none p-0 backdrop-blur-sm">
          <DialogTitle></DialogTitle>
          <div className="relative flex flex-col">
            {/* Glow effects */}
            <div className="absolute -right-4 size-32 -rotate-45 rounded-full border border-red-300/50 bg-gradient-to-br from-red-300/40 via-red-400/50 to-transparent blur-[150px] backdrop-blur-sm"></div>
            <div className="absolute -bottom-5 left-12 size-32 rotate-45 rounded-full border border-orange-300/50 bg-gradient-to-tl from-orange-300/40 via-orange-400/30 to-transparent blur-[150px] backdrop-blur-sm"></div>

            <div className="flex w-full flex-col px-6 pb-3">
              <div className="mb-2 font-geist text-3xl font-medium">
                Delete Review
              </div>
              <p className="mb-6 font-geist text-muted-foreground">
                Are you sure you want to delete this review? This action cannot
                be undone.
              </p>

              <div className="mt-8 flex justify-end gap-3 border-t pt-4 font-geist dark:border-gray-500/5">
                <Button
                  variant="outline"
                  className="h-11 w-24 rounded-2xl"
                  onClick={() => setIsDeleteReviewModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="h-11 w-24 rounded-2xl"
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
    <div className="container relative mx-auto pb-8">
      <div className="absolute -right-10 hidden md:block -top-20 h-[300px] w-[300px] -rotate-45 rounded-full bg-gradient-to-br from-amber-300/10 to-transparent blur-[80px] dark:from-orange-300/10"></div>

      <div className="group relative mb-12 h-[400px] w-full overflow-hidden rounded-2xl shadow-lg md:h-[300px]">
        <Image
          src={project?.image || "/placeholder.svg"}
          alt={(project?.name as string) || ""}
          fill
          quality={100}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          priority={true}
        />
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-zinc-900/90 via-zinc-900/60 to-transparent p-8 dark:from-black/80 dark:via-black/50">
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-900/90 to-transparent dark:from-black"></div>
          <div className="relative z-10 mb-4 flex items-center gap-3">
            <Badge
              variant="outline"
              className="h-8 rounded-full border-primary/30 bg-primary/10 px-3 font-geist text-xs font-normal text-white backdrop-blur-sm"
            >
              {project?.status}
            </Badge>
            <Badge
              variant="outline"
              className="h-8 rounded-full border-secondary/30 bg-secondary/20 px-3 font-geist font-normal text-secondary-foreground backdrop-blur-sm"
            >
              {project?.access}
            </Badge>
          </div>
          <h1 className="relative z-10 mb-4 font-geist text-4xl font-semibold text-white md:text-5xl">
            {project?.name}
          </h1>
          <div className="relative z-10 flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="relative h-10 w-10 overflow-hidden rounded-full ring-2 ring-white/20">
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
            <div className="flex items-center font-geist text-sm font-normal text-white/80">
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span>{timeAgo}</span>
            </div>
          </div>
          {project?.user.id === session.data?.user.id && (
            <div className="absolute right-6 top-6">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-white/20"
                  >
                    <SettingsIcon className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-44 rounded-xl border shadow-none dark:border-gray-500/5"
                >
                  <DropdownMenuItem
                    className="flex h-11 items-center gap-2 rounded-xl font-geist"
                    onClick={() => setIsEditModalOpen(true)}
                  >
                    <PencilIcon className="h-4 w-4" />
                    Edit Project
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="flex h-11 items-center gap-2 rounded-xl font-geist text-red-600 focus:text-red-600"
                  >
                    <Trash2Icon className="h-4 w-4" />
                    Delete Project
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div className="flex flex-wrap gap-2">
            {project?.category.map((cat: string) => (
              <Badge
                key={cat}
                variant="outline"
                className="h-8 rounded-full border-border/40 bg-background/50 px-3 font-geist text-sm font-normal backdrop-blur-sm"
              >
                {cat}
              </Badge>
            ))}
          </div>

          {/* Description */}
          <Card className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-500/5 dark:bg-card/50">
            <CardContent className="p-8">
              <h2 className="mb-6 font-geist text-4xl font-medium text-foreground">
                About this project
              </h2>
              <p className="font-geist text-sm font-normal leading-relaxed text-muted-foreground">
                {project?.description}
              </p>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-500/5 dark:bg-card/50">
            <CardContent className="p-8">
              <h2 className="mb-6 font-geist text-3xl font-normal text-foreground">
                Project Stats
              </h2>
              <div className="grid grid-cols-2 gap-6 text-center md:grid-cols-5">
                <div className="flex flex-col items-center">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white dark:border-gray-500/5 dark:bg-card/50">
                    <Star className="h-4 w-4 text-foreground" />
                  </div>
                  <span className="font-geist text-lg font-normal">
                    {project?._count.stars}
                  </span>
                  <span className="font-geist text-xs font-normal text-muted-foreground">
                    Stars
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white dark:border-gray-500/5 dark:bg-card/50">
                    <Heart
                      className="h-4 w-4 cursor-pointer text-foreground"
                      onClick={handleLikeProject}
                    />
                  </div>
                  <span className="font-geist text-lg font-normal">
                    {project?._count.followers}
                  </span>
                  <span className="font-geist text-xs font-normal text-muted-foreground">
                    Followers
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white dark:border-gray-500/5 dark:bg-card/50">
                    <MessageSquare className="h-4 w-4 text-foreground" />
                  </div>
                  <span className="font-geist text-lg font-normal">
                    {project?._count.reviews}
                  </span>
                  <span className="font-geist text-xs font-normal text-muted-foreground">
                    Reviews
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white dark:border-gray-500/5 dark:bg-card/50">
                    <Flag className="h-4 w-4 text-foreground" />
                  </div>
                  <span className="font-geist text-lg font-normal">
                    {project?._count?.updates as number}
                  </span>
                  <span className="font-geist text-xs font-normal text-muted-foreground">
                    Updates
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white dark:border-gray-500/5 dark:bg-card/50">
                    <Star className="h-4 w-4 text-foreground" />
                  </div>
                  <span className="font-geist text-lg font-normal">
                    {project?._count?.ratings as number}
                  </span>
                  <span className="font-geist text-xs font-normal text-muted-foreground">
                    Ratings
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Updates and Reviews Section */}
          <Card className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-500/5 dark:bg-card/50">
            <CardContent className="p-8">
              <h2 className="mb-6 font-geist text-3xl font-normal text-foreground">
                Project Activity
              </h2>

              <div className="w-full">
                {/* Custom Tab Headers */}
                <div className="mb-8 flex w-full overflow-hidden rounded-full border border-gray-100 bg-white p-1 dark:border-gray-500/5 dark:bg-card/50">
                  <button
                    onClick={() => setActiveTab("updates")}
                    className={`relative flex-1 rounded-full py-2.5 text-sm font-medium transition-all duration-300 ${
                      activeTab === "updates"
                        ? "text-white"
                        : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    }`}
                  >
                    {activeTab === "updates" && (
                      <span className="absolute inset-0 rounded-full bg-primary shadow-lg transition-all duration-300 dark:bg-secondary"></span>
                    )}
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Flag className="h-4 w-4" />
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
                      <span className="absolute inset-0 rounded-full bg-primary shadow-lg transition-all duration-300 dark:bg-secondary"></span>
                    )}
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <MessageSquare className="h-4 w-4" />
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
                      <div className="flex flex-col items-center justify-center rounded-xl bg-white py-12 text-center dark:bg-card/50">
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/10 to-indigo-500/10">
                          <PaintBucket className="h-10 w-10 text-indigo-500" />
                        </div>
                        <h3 className="mb-2 text-xl font-normal">
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
                    <div className="mx-auto mb-8 flex-col items-center space-y-4">
                      <Textarea
                        placeholder="Write your review here..."
                        value={reviewContent}
                        onChange={(e) => setReviewContent(e.target.value)}
                        className="min-h-[120px] w-full rounded-xl border border-gray-100 bg-white p-4 text-sm dark:border-gray-500/5 dark:bg-card/50"
                      />
                      <Button
                        onClick={handleCreateReview}
                        disabled={createReviewMutation.isPending}
                        className="right-0 mx-auto h-12 w-fit justify-end rounded-full border bg-primary font-medium text-white shadow-none transition-opacity hover:opacity-90 disabled:opacity-50 dark:border-gray-700/10 dark:bg-transparent"
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
                            className="group relative overflow-hidden rounded-xl border border-gray-100 bg-white p-6 dark:border-gray-500/5 dark:bg-card/50"
                          >
                            <div className="flex items-start gap-4">
                              <div className="relative h-10 w-10 overflow-hidden rounded-full ring-1 ring-white/10">
                                <Image
                                  src={review.user.image || "/placeholder.svg"}
                                  alt={review.user.visualName as string}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1">
                                <div className="mb-2 flex items-center justify-between">
                                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                                    {review.user.visualName}
                                  </h4>
                                  <span className="text-xs text-gray-500 dark:text-gray-400">
                                    {formatDistanceToNow(
                                      new Date(review.createdAt as string),
                                      {
                                        addSuffix: true,
                                      },
                                    )}
                                  </span>
                                </div>
                                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                                  {review.content}
                                </p>
                                {review.user.id === session.data?.user.id && (
                                  <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                                    <Button
                                      onClick={() =>
                                        handleEditReview(
                                          review.id as string,
                                          review.content as string,
                                        )
                                      }
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 rounded-full text-primary hover:text-primary/80"
                                    >
                                      <PencilIcon className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      onClick={() =>
                                        handleDeleteReview(review.id as string)
                                      }
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 rounded-full text-destructive hover:text-destructive"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center rounded-xl bg-white py-12 text-center dark:bg-card/50">
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/10 to-indigo-500/10">
                          <MessageSquare className="h-10 w-10 text-indigo-500" />
                        </div>
                        <h3 className="mb-2 text-xl font-normal text-gray-900 dark:text-gray-100">
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

        {/* Right Column - Sidebar */}
        <div className="space-y-8">
          <Card className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-500/5 dark:bg-card/50">
            <CardContent className="space-y-3 p-4">
              <Button
                variant="outline"
                className="h-11 w-full gap-2 rounded-full border-zinc-200/20 bg-white/5 text-sm font-medium text-zinc-900 backdrop-blur-sm transition-colors hover:bg-white/10 dark:border-zinc-800/20 dark:bg-black/5 dark:text-zinc-100 dark:hover:bg-black/10"
                onClick={handleStarProject}
              >
                {project?.stars?.some(
                  (each) => each.userId === session.data?.user.id,
                ) ? (
                  <GoStarFill className="h-4 w-4 text-yellow-500" />
                ) : (
                  <GoStar className="h-4 w-4" />
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
                      <Check className="h-4 w-4" />
                      <span>Following</span>
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4" />
                      <span>Follow</span>
                    </>
                  )}
                </Button>
              )}

              <Button
                onClick={() => setIsShareProjectDialogOpen(true)}
                variant="outline"
                className="h-11 w-full gap-2 rounded-full border-gray-100 bg-white text-sm font-medium text-gray-900 dark:border-gray-500/5 dark:bg-card/50 dark:text-gray-100"
              >
                <Share2 className="h-4 w-4" />
                Share project
              </Button>

              {isUserAuthor && (
                <Button
                  variant="outline"
                  className="h-11 w-full gap-2 rounded-full border-gray-100 bg-white text-sm font-medium text-gray-900 dark:border-gray-500/5 dark:bg-card/50 dark:text-gray-100"
                  onClick={() => setIsShareUpdateDialogOpen(true)}
                >
                  <PlusIcon className="h-4 w-4" />
                  Share Update
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Creator Profile */}
          <Card className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-500/5 dark:bg-card/50">
            <CardContent className="px-6 py-6">
              <h2 className="mb-4 text-center font-geist text-xl font-normal">
                Creator
              </h2>
              <div className="flex flex-col items-center text-center">
                <div className="relative mb-4 h-24 w-24 overflow-hidden rounded-full ring-2 ring-primary/20">
                  <Image
                    src={project?.user.image || "/placeholder.svg"}
                    alt={(project?.user.visualName as string) || ""}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-geist text-lg font-normal">
                  {project?.user.visualName}
                </h3>
                <span className="mb-2 font-geist text-sm font-normal text-muted-foreground">
                  Nerd at: {project?.user.nerdAt}
                </span>
                <p className="mb-2 font-geist text-sm font-normal text-muted-foreground">
                  {project?.user.bio}
                </p>
                <Separator className="mb-2" />
                <Link
                  href={`/user-profile/${project?.userId}`}
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-4 w-4" />
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
        <DialogContent className="max-w-md overflow-hidden rounded-xl border-none p-0 backdrop-blur-sm">
          <DialogTitle></DialogTitle>
          <div className="relative flex flex-col">
            {/* Glow effects */}
            <div className="absolute -right-4 size-32 -rotate-45 rounded-full border border-red-300/50 bg-gradient-to-br from-red-300/40 via-red-400/50 to-transparent blur-[150px] backdrop-blur-sm"></div>
            <div className="absolute -bottom-5 left-12 size-32 rotate-45 rounded-full border border-orange-300/50 bg-gradient-to-tl from-orange-300/40 via-orange-400/30 to-transparent blur-[150px] backdrop-blur-sm"></div>

            <div className="flex w-full flex-col px-6 pb-3">
              <div className="mb-2 font-geist text-3xl font-medium">
                Delete Project
              </div>
              <p className="mb-6 font-geist text-muted-foreground">
                Are you sure you want to delete this project? This action cannot
                be undone.
              </p>

              <div className="mt-8 flex justify-end gap-3 border-t pt-4 font-geist dark:border-gray-500/5">
                <Button
                  variant="outline"
                  className="h-11 w-24 rounded-2xl"
                  onClick={() => setIsDeleteModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDeleteProject}
                  className="h-11 w-24 rounded-2xl bg-red-600 text-white hover:bg-red-600"
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
        <DialogContent className="max-w-4xl overflow-hidden rounded-xl border-none p-0 backdrop-blur-sm">
          <div className="relative flex h-[85vh] max-h-[85vh] flex-col md:flex-row">
            {/* Glow effects */}
            <div className="absolute hidden md:block -right-4 size-32 -rotate-45 rounded-full border border-blue-300/50 bg-gradient-to-br from-blue-300/40 via-blue-400/50 to-transparent blur-[150px] backdrop-blur-sm"></div>
            <div className="absolute hidden md:block -bottom-5 left-12 size-32 rotate-45 rounded-full border border-orange-300/50 bg-gradient-to-tl from-orange-300/40 via-orange-400/30 to-transparent blur-[150px] backdrop-blur-sm"></div>

            {/* Left Column */}
            <div className="flex w-full flex-col rounded-l-xl border-b border-l border-r border-t p-6 dark:border-gray-600/10 dark:bg-black md:w-1/3">
              <div className="mb-2 font-geist text-3xl font-medium">
                Share Update
              </div>
              <p className="mb-6 font-geist text-muted-foreground">
                Share a new update about your project&apos;s progress
              </p>

              <div className="mt-4 flex flex-1 flex-col items-center justify-center">
                <div className="relative mb-4 aspect-square w-full max-w-[220px] overflow-hidden rounded-xl border-2 border-dashed border-primary/20 bg-black">
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
                    <div className="flex h-full w-full items-center justify-center font-geist text-muted-foreground">
                      No image
                    </div>
                  )}
                </div>

                <div className="relative w-full max-w-[220px]">
                  <Button
                    className="b h-11 w-full rounded-full font-geist"
                    type="button"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    {updateImage ? "Change Image" : "Upload Image"}
                  </Button>
                  <Input
                    type="file"
                    className="absolute inset-0 cursor-pointer opacity-0"
                    accept="image/*"
                    onChange={handleUpdateImageChange}
                  />
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                <div className="rounded-xl border border-gray-100 bg-card p-4 shadow-none dark:border-gray-500/5">
                  <h3 className="mb-4 font-geist text-lg font-medium">
                    Update Details
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="title"
                        className="font-geist text-sm font-medium"
                      >
                        Title
                      </Label>
                      <Input
                        id="title"
                        value={updateTitle}
                        onChange={(e) => setUpdateTitle(e.target.value)}
                        placeholder="Enter update title"
                        className="h-11 rounded-xl border-input/50 font-geist shadow-none focus-visible:ring-primary/50 dark:border-gray-500/5"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="content"
                        className="font-geist text-sm font-medium"
                      >
                        Content
                      </Label>
                      <Textarea
                        id="content"
                        value={updateContent}
                        onChange={(e) => setUpdateContent(e.target.value)}
                        placeholder="Share your progress..."
                        rows={6}
                        className="resize-none rounded-xl border-input/50 font-geist shadow-none focus-visible:ring-primary/50 dark:border-gray-500/5"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3 border-t pt-4 font-geist dark:border-gray-500/5">
                <Button
                  variant="outline"
                  className="h-11 w-24 rounded-2xl"
                  onClick={() => setIsShareUpdateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleShareUpdate}
                  className="h-11 w-fit gap-2 rounded-2xl"
                  disabled={isSubmittingUpdate}
                >
                  {isSubmittingUpdate ? (
                    <>
                      <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24">
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
                      <Check className="h-4 w-4" />
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
        <DialogContent className="max-w-md overflow-hidden rounded-xl border-none p-0 backdrop-blur-sm">
          <DialogTitle></DialogTitle>
          <div className="relative flex flex-col">
            {/* Glow effects */}
            <div className="absolute -right-4 size-32 -rotate-45 rounded-full border border-primary/50 bg-gradient-to-br from-primary/40 via-primary/50 to-transparent blur-[150px] backdrop-blur-sm"></div>
            <div className="absolute -bottom-5 left-12 size-32 rotate-45 rounded-full border border-secondary/50 bg-gradient-to-tl from-secondary/40 via-secondary/30 to-transparent blur-[150px] backdrop-blur-sm"></div>

            <div className="flex w-full flex-col px-6 pb-3">
              <div className="mb-2 font-geist text-3xl font-medium">
                Share Project
              </div>
              <p className="font-geist text-sm text-muted-foreground">
                Share this project as a post to let others discover it. This
                will create a new post featuring your project.
              </p>

              <div className="mt-8 flex justify-end gap-3 border-t pt-4 font-geist dark:border-gray-500/5">
                <Button
                  variant="outline"
                  className="h-11 w-24 rounded-2xl"
                  onClick={() => setIsShareProjectDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    await postAsPostMutation.mutate();
                    setIsShareProjectDialogOpen(false);
                  }}
                  className="h-11 w-fit gap-2 rounded-2xl"
                >
                  <Share2 className="h-4 w-4" />
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
