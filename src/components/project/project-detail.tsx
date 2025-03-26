import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
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
import { fetchProject } from "@/functions/fetchProject";
import { useQuery, useMutation } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  CalendarIcon,
  ExternalLink,
  Flag,
  Heart,
  MessageSquare,
  PaintBucket,
  Share2,
  Star,
  Edit,
  Upload,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ProjectDetailSkeleton from "../skeleton/project-detail.skeleton";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { queryClient } from "@/providers/tanstack-query-provider";
import { authClient } from "@/lib/auth-client";
import { Separator } from "../ui/separator";

const ProjectDetail = ({ projectId }: { projectId: string }) => {
  const router = useRouter();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editedProject, setEditedProject] = useState<any>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const session = authClient.useSession();

  const {
    data: project,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const response = await axios.get(`/api/project/${projectId}`);
      return response.data.data;
    },
    enabled: !!projectId,
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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

  const handleEditProject = async () => {
    let imageUrl = project.image;

    if (selectedImage instanceof File) {
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
        );
        imageUrl = response.data.secure_url;
      } catch (error) {
        console.error("Image upload failed:", error);
        toast.error("Image upload failed");
        return;
      }
    }

    const updatedProjectData = {
      name: editedProject?.name || project.name,
      description: editedProject?.description || project.description,
      image: imageUrl,
      status: editedProject?.status || project.status,
      access: editedProject?.access || project.access,
      category: [...new Set([...project.category, ...selectedCategories])],
    };

    await updateMutation.mutate(updatedProjectData);
  };

  if (isLoading) {
    return <ProjectDetailSkeleton />;
  }

  if (error) return <div>Error loading project data</div>;

  const createdDate = new Date(project.createdAt);
  const timeAgo = formatDistanceToNow(createdDate, { addSuffix: true });

  return (
    <div className="container mx-auto max-w-6xl px-4">
      <div className="relative mb-8 h-[300px] w-full overflow-hidden rounded-xl md:h-[300px]">
        <Image
          src={project.image || "/placeholder.svg"}
          alt={project.name}
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
              {project.status}
            </Badge>
            <Badge
              variant="outline"
              className="border-secondary/30 bg-secondary/20 text-secondary-foreground"
            >
              {project.access}
            </Badge>
          </div>
          <h1 className="relative z-10 mb-2 font-instrument text-3xl text-white md:text-4xl">
            {project.name}
          </h1>
          <div className="relative z-10 flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="relative h-8 w-8 overflow-hidden rounded-full">
                <Image
                  src={project.user.image || "/placeholder.svg"}
                  alt={project.user.visualName}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="font-medium text-white">
                {project.user.visualName}
              </span>
            </div>
            <div className="flex items-center text-sm text-white/80">
              <CalendarIcon className="mr-1 h-4 w-4" />
              <span>{timeAgo}</span>
            </div>
          </div>
          {project.user.id === session.data?.user.id && (
            <div className="absolute right-4 top-4">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Edit className="h-4 w-4" />
                Edit
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div className="flex flex-wrap gap-2">
            {project.category.map((cat: any) => (
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
              <p className="text-muted-foreground">{project.description}</p>
            </CardContent>
          </Card>

          {/* Stats */}
          <Card className="rounded-lg border-card-foreground/5 shadow-none dark:border-gray-500/5">
            <CardContent className="p-6">
              <h2 className="mb-4 font-instrument text-3xl">Project Stats</h2>
              <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-5">
                <div className="flex flex-col items-center">
                  <Star className="mb-1 h-5 w-5 text-yellow-500" />
                  <span className="font-bold">{project._count.stars}</span>
                  <span className="text-xs text-muted-foreground">Stars</span>
                </div>
                <div className="flex flex-col items-center">
                  <Heart className="mb-1 h-5 w-5 text-red-500" />
                  <span className="font-bold">{project._count.followers}</span>
                  <span className="text-xs text-muted-foreground">
                    Followers
                  </span>
                </div>
                <div className="flex flex-col items-center">
                  <MessageSquare className="mb-1 h-5 w-5 text-blue-500" />
                  <span className="font-bold">{project._count.reviews}</span>
                  <span className="text-xs text-muted-foreground">Reviews</span>
                </div>
                <div className="flex flex-col items-center">
                  <Flag className="mb-1 h-5 w-5 text-green-500" />
                  <span className="font-bold">{project._count.updates}</span>
                  <span className="text-xs text-muted-foreground">Updates</span>
                </div>
                <div className="flex flex-col items-center">
                  <Star className="mb-1 h-5 w-5 text-purple-500" />
                  <span className="font-bold">{project._count.ratings}</span>
                  <span className="text-xs text-muted-foreground">Ratings</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Updates Section (Empty State) */}
          <Card className="rounded-lg border-card-foreground/5 shadow-none dark:border-gray-500/5">
            <CardContent className="p-6">
              <h2 className="mb-4 font-instrument text-3xl">Project Updates</h2>
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
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-8">
          {/* Action Buttons */}
          <Card className="rounded-lg border-card-foreground/10 shadow-none dark:border-gray-500/5">
            <CardContent className="space-y-4 p-6">
              <Button className="w-full gap-2">
                <Heart className="h-4 w-4" />
                Follow Project
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <Star className="h-4 w-4" />
                Star Project
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <Share2 className="h-4 w-4" />
                Share
              </Button>
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
                    src={project.user.image || "/placeholder.svg"}
                    alt={project.user.visualName}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-bold">{project.user.visualName}</h3>
                <span className="mb-2 text-sm text-muted-foreground">
                  Nerd at: {project.user.nerdAt}
                </span>
                <p className="text-sm">{project.user.bio}</p>
                <Separator className="my-4" />
                <Link
                  href={`/user-profile/${project.userId}`}
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  {/* <ExternalLink className="h-4 w-4" /> */}
                  Connect with {project.user.visualName}
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

      {/* Edit Project Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogTrigger asChild>
          <Button className="hidden">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Fill in the details to edit the project. Click save when you're
              done.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={editedProject?.name || project.name}
                onChange={(e) =>
                  setEditedProject((prev: any) => ({
                    ...prev,
                    name: e.target.value,
                  }))
                }
                placeholder="Enter project name"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={editedProject?.description || project.description}
                onChange={(e) =>
                  setEditedProject((prev: any) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Describe your project"
                rows={4}
              />
            </div>

            <div className="grid gap-2">
              <Label>Project Image</Label>
              <div className="mt-2 flex items-center justify-center">
                <div className="relative h-10 w-full">
                  <Button variant="outline" className="w-full" type="button">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Custom Image
                  </Button>
                  <Input
                    type="file"
                    className="absolute inset-0 cursor-pointer opacity-0"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </div>
              </div>
              {selectedImage && (
                <div className="mt-4 flex flex-col items-center">
                  <img
                    src={URL.createObjectURL(selectedImage)}
                    alt="Selected"
                    className="h-40 w-40 object-cover"
                  />
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={handleImageCancel}
                  >
                    Cancel
                  </Button>
                </div>
              )}
              {!selectedImage && project.image && (
                <div className="mt-4 flex flex-col items-center">
                  <img
                    src={project.image}
                    alt="Existing"
                    className="h-40 w-40 object-cover"
                  />
                </div>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={editedProject?.status || project.status}
                onValueChange={(value) =>
                  setEditedProject((prev: any) => ({
                    ...prev,
                    status: value as
                      | "ONGOING"
                      | "COMPLETED"
                      | "PAUSED"
                      | "CANCELLED",
                  }))
                }
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ONGOING">Ongoing</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="PAUSED">Paused</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="access">Access</Label>
              <Select
                value={editedProject?.access || project.access}
                onValueChange={(value) =>
                  setEditedProject((prev: any) => ({
                    ...prev,
                    access: value as "public" | "private",
                  }))
                }
              >
                <SelectTrigger id="access">
                  <SelectValue placeholder="Select access" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="category">Categories</Label>
              <Input
                id="category"
                placeholder="Type a category and press space"
                onKeyDown={handleCategoryInput}
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {[...new Set([...project.category, ...selectedCategories])].map(
                  (category) => (
                    <span
                      key={category}
                      className="flex items-center gap-1 rounded-full bg-white px-2 py-1 text-xs dark:bg-white/50 dark:text-black"
                    >
                      {category}
                      <button
                        type="button"
                        className="text-red-500"
                        onClick={() => handleRemoveCategory(category)}
                      >
                        &times;
                      </button>
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditProject}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProjectDetail;
