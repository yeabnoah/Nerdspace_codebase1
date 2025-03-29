import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/providers/tanstack-query-provider";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import {
  CalendarIcon,
  Flag,
  Heart,
  MessageSquare,
  PaintBucket,
  PlusIcon,
  SettingsIcon,
  Share2,
  Star,
  Upload,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import ProjectDetailSkeleton from "../skeleton/project-detail.skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Separator } from "../ui/separator";
import { EditProjectDialog } from "@/components/ui/edit-project-dialog";
import ProjectInterface from "@/interface/auth/project.interface";
import { UpdateInterface } from "@/interface/auth/project.interface";
import UpdateCard from "./project-update-card";
import { GoStar, GoStarFill } from "react-icons/go";

const ProjectDetail = ({ projectId }: { projectId: string }) => {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedProject, setEditedProject] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isShareUpdateDialogOpen, setIsShareUpdateDialogOpen] = useState(false);
  const [updateTitle, setUpdateTitle] = useState("");
  const [updateContent, setUpdateContent] = useState("");
  const [updateImage, setUpdateImage] = useState<File | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  // const [isStarred, setIsStarred] = useState(false);
  const session = authClient.useSession();

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
      await axios.post(`/api/project/update/like?projectId=${projectId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
    onError: () => {
      toast.error("Failed to update like. Please try again.");
    },
  });

  const handleLikeProject = () => {
    likeMutation.mutate();
    setIsLiked((prev) => !prev); // Toggle like state
  };

  const starMutation = useMutation({
    mutationFn: async () => {
      await axios.post(`/api/project/star?projectId=${projectId}`);
    },
    onSuccess: () => {
      toast.success("Star status updated!");
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    },
    onError: () => {
      toast.error("Failed to update star status. Please try again.");
    },
  });

  const handleStarProject = () => {
    starMutation.mutate();
    // setIsStarred((prev) => !prev); // Toggle star state
  };

  const followMutation = useMutation({
    mutationFn: async () => {
      await axios.post(`/api/project/follow?projectId=${projectId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
      toast.success("Follow status updated!");
    },
    onError: () => {
      toast.error("Failed to update follow status. Please try again.");
    },
  });

  const handleFollowProject = () => {
    followMutation.mutate();
    setIsFollowing((prev) => !prev); // Toggle follow state
  };

  const postAsPostMutation = useMutation({
    mutationKey: ["postaspost", projectId],
    mutationFn: async () => {
      const response = await axios.post(
        `/api/project/update/share`,
        {
          content:
            project?.userId === session.data?.user.id
              ? "This is my project and I'd  like to share it with you"
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
    mutationFn: async (updatedProjectData: any) => {
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
    onError: (error: any) => {
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
      router.push("/projects"); // Redirect to projects list after deletion
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while deleting the project";
      toast.error(errorMessage);
    },
  });

  const handleDeleteProject = async () => {
    await deleteMutation.mutate();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log("Image selected:", file); // Debugging log
      setSelectedImage(file);
    }
  };

  const handleImageCancel = () => {
    setSelectedImage(null);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
  };

  const handleCategoryInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " ") {
      const category = e.currentTarget.value.trim();
      if (category && !selectedCategories.includes(category)) {
        setSelectedCategories([...selectedCategories, category]);
      }
      e.currentTarget.value = "";
    }
  };

  const handleRemoveCategory = (category: string) => {
    setSelectedCategories((prev) => prev.filter((c) => c !== category));
  };

  const handleEditProject = async (
    updatedProjectData: Partial<typeof project>,
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

  const handleDeleteUpdate = (updateId: string) => {
    if (project) {
      project.updates = project.updates.filter(
        (update) => update.id !== updateId,
      );
    }
  };

  const handleShareUpdate = async () => {
    if (!updateTitle || !updateContent) {
      toast.error("Title and content are required.");
      return;
    }

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

      // Reset the state for creating an update
      setUpdateTitle("");
      setUpdateContent("");
      setUpdateImage(null);

      queryClient.invalidateQueries({ queryKey: ["project", projectId] });
    } catch (error) {
      console.error("Error sharing update:", error);
      toast.error("Failed to share update. Please try again.");
    }
  };

  const handleUpdateImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUpdateImage(file);
    }
  };

  if (isLoading) {
    return <ProjectDetailSkeleton />;
  }

  if (error) return <div>Error loading project data</div>;

  const createdDate = new Date(project?.createdAt || Date.now());
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });

  const isuserAuthor = session.data?.user.id === project?.userId;

  return (
    <div className="container mx-auto max-w-6xl px-4">
      <div className="relative mb-8 h-[300px] w-full overflow-hidden rounded-xl md:h-[300px]">
        <Image
          src={project?.image || "/placeholder.svg"}
          alt={(project?.name as string) || ""}
          fill
          quality={100}
          className="object-cover"
          priority={true}
        />
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/70 to-transparent p-6">
          {/* Bottom Gradient Shadow */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent"></div>
          <div className="relative z-10 mb-2 flex items-center gap-2">
            <Badge
              variant="outline"
              className="border-primary/30 bg-primary/10 text-xs text-white"
            >
              {project?.status}
            </Badge>
            <Badge
              variant="outline"
              className="border-secondary/30 bg-secondary/20 text-secondary-foreground"
            >
              {project?.access}
            </Badge>
          </div>
          <h1 className="relative z-10 mb-2 font-instrument text-3xl text-white md:text-4xl">
            {project?.name}
          </h1>
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8 overflow-hidden rounded-full">
                <Image
                  src={project?.user.image || "/placeholder.svg"}
                  alt={project?.user.visualName as string}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-medium text-white">
                {project?.user.visualName}
              </span>
            </div>
            <div className="flex items-center text-sm text-white/80">
              <CalendarIcon className="mr-1 h-4 w-4" />
              <span>{timeAgo}</span>
            </div>
          </div>
          {project?.user.id === session.data?.user.id && (
            <div className="absolute right-4 top-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-2">
                    <SettingsIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setIsEditModalOpen(true)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setIsDeleteModalOpen(true)}
                    className="text-red-500"
                  >
                    Delete
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
            {project?.category.map((cat: any) => (
              <Badge
                key={cat}
                variant="outline"
                className="text-sm font-normal"
              >
                {cat}
              </Badge>
            ))}
          </div>

          {/* Description */}
          <Card className="rounded-lg border-card-foreground/5 shadow-none dark:border-gray-500/5">
            <CardContent className="p-6">
              <h2 className="mb-4 font-instrument text-3xl">
                About This Project
              </h2>
              <p className="text-muted-foreground">{project?.description}</p>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card className="rounded-lg border-card-foreground/5 shadow-none dark:border-gray-500/5">
            <CardContent className="p-6">
              <h2 className="mb-4 font-instrument text-3xl">Project Stats</h2>
              <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-5">
                <div className="flex flex-col items-center">
                  <Star className="mb-1 h-5 w-5 text-yellow-500" />
                  <span className="font-bold">{project?._count.stars}</span>
                  <span className="text-xs text-muted-foreground">Stars</span>
                </div>
                <div className="flex flex-col items-center">
                  <Heart className="mb-1 h-5 w-5 text-red-500" />
                  <span className="font-bold">{project?._count.followers}</span>
                  <span className="text-xs text-muted-foreground">
                    Followers
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <MessageSquare className="mb-1 h-5 w-5 text-blue-500" />
                  <span className="font-bold">{project?._count.reviews}</span>
                  <span className="text-xs text-muted-foreground">Reviews</span>
                </div>
                <div className="flex flex-col items-center">
                  <Flag className="mb-1 h-5 w-5 text-green-500" />
                  <span className="font-bold">
                    {project?._count?.updates as number}
                  </span>
                  <span className="text-xs text-muted-foreground">Updates</span>
                </div>
                <div className="flex flex-col items-center">
                  <Star className="mb-1 h-5 w-5 text-purple-500" />
                  <span className="font-bold">
                    {project?._count?.ratings as number}
                  </span>
                  <span className="text-xs text-muted-foreground">Ratings</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Updates Section */}
          <Card className="rounded-lg border-card-foreground/5 shadow-none dark:border-gray-500/5">
            <CardContent className="p-6">
              <h2 className="mb-4 font-instrument text-3xl">Project Updates</h2>
              {project?.updates && project.updates.length > 0 ? (
                project.updates.map((update, index) => {
                  return (
                    <UpdateCard
                      update={update}
                      key={index}
                      isOwner={project?.user.id === session.data?.user.id}
                    />
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                    <PaintBucket className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium">No updates yet</h3>
                  <p className="mt-2 max-w-md text-muted-foreground">
                    This project hasn't posted any updates. Check back later for
                    progress on this mission to Mars.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-8">
          {/* Action Buttons */}
          <Card className="rounded-lg border-card-foreground/10 shadow-none dark:border-gray-500/5">
            <CardContent className="space-y-4 p-6">
              <Button
                variant={"outline"}
                className="w-full gap-2"
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

              {!isuserAuthor && (
                <>
                  <Button
                    variant={isFollowing ? "outline" : "default"}
                    className="w-full gap-2"
                    onClick={handleFollowProject}
                  >
                    {isFollowing ? "Unfollow" : "Follow"}
                  </Button>
                </>
              )}

              <Button
                onClick={async () => {
                  await postAsPostMutation.mutate();
                }}
                variant="outline"
                className="w-full gap-2"
              >
                <Share2 className="h-4 w-4" />
                Share project
              </Button>

              {isuserAuthor && (
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={() => setIsShareUpdateDialogOpen(true)}
                >
                  <PlusIcon className="h-4 w-4" />
                  Share Update
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Creator Profile */}
          <Card className="rounded-lg border-card-foreground/10 shadow-none dark:border-gray-500/5">
            <CardContent className="px-6 py-3">
              <h2 className="mb-2 text-center font-instrument text-xl font-bold">
                Creator
              </h2>
              <div className="flex flex-col items-center text-center">
                <div className="relative h-24 w-24 overflow-hidden rounded-full">
                  <Image
                    src={project?.user.image || "/placeholder.svg"}
                    alt={(project?.user.visualName as string) || ""}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-bold">
                  {project?.user.visualName}
                </h3>
                <span className="mb-2 text-sm text-muted-foreground">
                  Nerd at: {project?.user.nerdAt}
                </span>
                <p className="text-sm">{project?.user.bio}</p>
                <Separator className="my-4" />
                <Link
                  href={`/user-profile/${project?.userId}`}
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  Connect with {project?.user.visualName}
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Similar Projects Placeholder */}
          <Card className="rounded-lg border-card-foreground/10 shadow-none dark:border-gray-500/5">
            <CardContent className="p-6">
              <h2 className="mb-4 font-instrument text-3xl">
                Similar Projects
              </h2>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-16 rounded-md bg-muted"></div>
                  <div>
                    <h3 className="font-medium">Mars Rover</h3>
                    <p className="text-xs text-muted-foreground">By SpaceX</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-16 rounded-md bg-muted"></div>
                  <div>
                    <h3 className="font-medium">Lunar Gateway</h3>
                    <p className="text-xs text-muted-foreground">By NASA</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-16 rounded-md bg-muted"></div>
                  <div>
                    <h3 className="font-medium">Artemis Program</h3>
                    <p className="text-xs text-muted-foreground">By ESA</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
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
        <DialogTrigger asChild>
          <Button className="hidden">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this project? This action cannot``
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteProject}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Share Update Dialog */}
      <Dialog
        open={isShareUpdateDialogOpen}
        onOpenChange={setIsShareUpdateDialogOpen}
      >
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Share a New Update</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Update Title"
              value={updateTitle}
              onChange={(e) => setUpdateTitle(e.target.value)}
            />
            <Textarea
              placeholder="Update Content"
              value={updateContent}
              onChange={(e) => setUpdateContent(e.target.value)}
            />
            <Input
              type="file"
              accept="image/*"
              onChange={handleUpdateImageChange}
            />
            {updateImage && (
              <div className="relative h-40 w-full overflow-hidden rounded-md">
                <Image
                  src={URL.createObjectURL(updateImage)}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsShareUpdateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleShareUpdate}>Share</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectDetail;
