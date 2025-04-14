"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import ProjectInterface, {
  ProjectInterfaceToSubmit,
} from "@/interface/auth/project.interface";
import { queryClient } from "@/providers/tanstack-query-provider";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  AlertCircle,
  Check,
  Globe,
  Lock,
  Plus,
  Tag,
  Upload,
  X
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { ProjectCardSkeleton } from "../skeleton/project-card";
import LeaderboardPage from "./leaderBorad";
import ProjectCard from "./project-card";

const cloudinaryUploadUrl = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL!;
const cloudinaryUploadPreset =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

export default function ProjectsPage() {
  const [searchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProject, setNewProject] = useState<ProjectInterfaceToSubmit>({
    name: "",
    description: "",
    status: "ONGOING",
    category: [],
    access: "private",
    image: "",
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<File | null>();
  const [activeTab, setActiveTab] = useState("projects"); // Track active tab
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleImageCancel = () => {
    setSelectedImage(null);
  };

  const [projects, setProjects] = useState<ProjectInterface[]>([]);
  const {
    data: projecter,
    isLoading,
  } = useQuery<ProjectInterface[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await axios.get("/api/project");
      setProjects(response.data.data);
      return response.data.data;
    },
  });

  const mutation = useMutation<ProjectInterface, Error, ProjectInterfaceToSubmit>({
    mutationKey: ["create-project"],
    mutationFn: async (newProjectData) => {
      const response = await axios.post("/api/project", newProjectData);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Project successfully created");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error) => {
      const errorMessage =
        error ||
        "An error occurred while creating the project";
      toast.error(errorMessage);
    },
  });

  const updateMutation = useMutation({
    mutationKey: ["update-project"],
    mutationFn: async (updatedProjectData: ProjectInterfaceToSubmit) => {
      const response = await axios.patch("/api/project", updatedProjectData);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Project successfully updated");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error) => {
      const errorMessage =
        error ||
        "An error occurred while updating the project";
      toast.error(errorMessage);
    },
  });

  // const deleteMutation = useMutation({
  //   mutationKey: ["delete-project"],
  //   mutationFn: async (projectId) => {
  //     const response = await axios.delete("/api/project", {
  //       data: { id: projectId },
  //     });
  //     return response.data;
  //   },
  //   onSuccess: () => {
  //     toast.success("Project successfully deleted");
  //     queryClient.invalidateQueries({ queryKey: ["projects"] });
  //   },
  //   onError: (error) => {
  //     const errorMessage =
  //       error ||
  //       "An error occurred while deleting the project";
  //     toast.error(errorMessage);
  //   },
  // });

  const filteredProjects = projects?.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      project.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleCreateProject = async () => {
    setIsSubmitting(true);
    let imageUrl = "";

    if (selectedImage instanceof File) {
      const formData = new FormData();
      formData.append("file", selectedImage);
      formData.append("upload_preset", cloudinaryUploadPreset);

      try {
        const response = await axios.post(cloudinaryUploadUrl, formData);
        imageUrl = response.data.secure_url;
      } catch (error) {
        console.error("Image upload failed:", error);
        toast.error("Image upload failed");
        setIsSubmitting(false);
        return;
      }
    }

    const newProjectData: ProjectInterfaceToSubmit = {
      name: newProject.name,
      description: newProject.description,
      status: newProject.status,
      category: selectedCategories,
      access: newProject.access,
      image:
        imageUrl ||
        `https://images.unsplash.com/photo-1617791160505-6f00504e3519?q=80&w=1000`,
    };

    try {
      await mutation.mutateAsync(newProjectData);
      setNewProject({
        name: "",
        description: "",
        status: "ONGOING",
        category: [],
        access: "private",
        image: "",
      });
      setSelectedCategories([]);
      setSelectedImage(null);
      setIsCreateModalOpen(false);
    } catch (error) {
      console.error("Project creation failed:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleUpdateProject = async () => {
  //   let imageUrl = "";

  //   if (selectedImage instanceof File) {
  //     const formData = new FormData();
  //     formData.append("file", selectedImage);
  //     formData.append("upload_preset", cloudinaryUploadPreset);

  //     try {
  //       const response = await axios.post(cloudinaryUploadUrl, formData);
  //       imageUrl = response.data.secure_url;
  //     } catch (error) {
  //       console.error("Image upload failed:", error);
  //       toast.error("Image upload failed");
  //       return;
  //     }
  //   }

  //   const updatedProjectData: ProjectInterfaceToSubmit = {
  //     name: newProject.name,
  //     description: newProject.description,
  //     status: newProject.status,
  //     category: selectedCategories,
  //     access: newProject.access,
  //     image: imageUrl || newProject.image,
  //   };

  //   await updateMutation.mutate(updatedProjectData as ProjectInterfaceToSubmit);

  //   // Reset form and close modal
  //   setNewProject({
  //     name: "",
  //     description: "",
  //     status: "ONGOING",
  //     category: [],
  //     access: "private",
  //     image: "",
  //   });
  //   setSelectedCategories([]);
  //   setSelectedImage(null);
  //   setIsCreateModalOpen(false);
  // };

  // const toggleCategory = (category: string) => {
  //   setSelectedCategories((prev) =>
  //     prev.includes(category)
  //       ? prev.filter((c) => c !== category)
  //       : [...prev, category],
  //   );
  // };

  const handleCategoryInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " ") {
      const category = e.currentTarget.value.trim();
      if (category && !selectedCategories.includes(category)) {
        setSelectedCategories([...selectedCategories, category]);
      }
      e.currentTarget.value = "";
    }
  };

  console.log(activeTab, projecter)

  return (
    <div className="container mx-auto w-full px-8 py-2 dark:bg-black">
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h1 className="font-geist text-3xl font-medium">Projects</h1>

        <div className="flex w-full flex-col gap-4 sm:flex-row md:w-auto">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-11 w-full rounded-xl border-gray-100 dark:border-gray-500/10 sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-gray-100 dark:border-gray-500/10 dark:bg-black">
              <SelectItem value="all" className="font-geist">
                All Status
              </SelectItem>
              <SelectItem value="ongoing" className="font-geist">
                Ongoing
              </SelectItem>
              <SelectItem value="completed" className="font-geist">
                Completed
              </SelectItem>
              <SelectItem value="paused" className="font-geist">
                Paused
              </SelectItem>
              <SelectItem value="cancelled" className="font-geist">
                Cancelled
              </SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button
                className="h-11 w-full cursor-pointer rounded-xl sm:w-auto"
                onClick={() => setIsCreateModalOpen(true)}
              >
                <Plus className="h-4" />
                Create Project
              </Button>
            </DialogTrigger>
            <DialogContent
              className="max-w-4xl overflow-hidden rounded-xl border-none p-0 backdrop-blur-sm"
              aria-describedby="create-project-description"
            >
              <p id="create-project-description" className="sr-only font-geist">
                Fill in the details to create a new project.
              </p>
              <div className="relative flex h-[85vh] max-h-[85vh] flex-col md:flex-row">
                {/* Glow effects */}
                <div className="absolute -right-4 size-32 -rotate-45 rounded-full border border-blue-300/50 bg-gradient-to-br from-blue-300/40 via-blue-400/50 to-transparent blur-[150px] backdrop-blur-sm"></div>
                <div className="absolute -bottom-5 left-12 size-32 rotate-45 rounded-full border border-orange-300/50 bg-gradient-to-tl from-orange-300/40 via-orange-400/30 to-transparent blur-[150px] backdrop-blur-sm"></div>

                <DialogTitle></DialogTitle>
                <div className="flex w-full flex-col rounded-l-xl border-b border-l border-r border-t p-6 dark:border-gray-600/10 dark:bg-black md:w-1/3">
                  <div className="mb-2 font-geist text-3xl font-medium">
                    New Project
                  </div>
                  <p className="mb-6 font-geist text-muted-foreground">
                    Fill in the details to create a new project
                  </p>

                  <div className="mt-4 flex flex-1 flex-col items-center justify-center">
                    <div className="relative mb-4 aspect-square w-full max-w-[220px] overflow-hidden rounded-xl border-2 border-dashed border-primary/20 dark:bg-black">
                      {selectedImage ? (
                        <img
                          src={URL.createObjectURL(selectedImage)}
                          alt="Selected"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center font-geist text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="relative w-full max-w-[220px]">
                      <Button
                        className="h-11 w-full rounded-full font-geist"
                        type="button"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {selectedImage ? "Change Image" : "Upload Image"}
                      </Button>
                      <Input
                        type="file"
                        className="absolute inset-0 cursor-pointer opacity-0"
                        accept="image/*"
                        onChange={handleImageChange}
                      />
                    </div>

                    {selectedImage && (
                      <div className="mt-2 font-geist">
                        <p>Selected Image: {selectedImage.name}</p>
                        <Button variant="outline" onClick={handleImageCancel}>
                          Remove Image
                        </Button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  <Tabs defaultValue="details" className="w-full">
                    <TabsList className="mb-6 grid h-12 w-full grid-cols-2 rounded-full border border-gray-100 dark:border-gray-500/10 dark:bg-black">
                      <TabsTrigger
                        value="details"
                        className="h-10 rounded-full font-geist"
                      >
                        Project Details
                      </TabsTrigger>
                      <TabsTrigger
                        value="settings"
                        className="h-10 rounded-full font-geist"
                      >
                        Settings & Categories
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-6">
                      <div className="rounded-xl border border-gray-100 bg-card p-4 shadow-none dark:border-gray-500/5">
                        <h3 className="mb-4 font-geist text-lg font-medium">
                          Basic Information
                        </h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label
                              htmlFor="name"
                              className="font-geist text-sm font-medium"
                            >
                              Project Name
                            </Label>
                            <Input
                              id="name"
                              value={newProject.name}
                              onChange={(e) =>
                                setNewProject({
                                  ...newProject,
                                  name: e.target.value,
                                })
                              }
                              placeholder="Enter project name"
                              className="h-11 rounded-xl border-input/50 font-geist shadow-none focus-visible:ring-primary/50 dark:border-gray-500/5"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor="description"
                              className="font-geist text-sm font-medium"
                            >
                              Description
                            </Label>
                            <Textarea
                              id="description"
                              value={newProject.description}
                              onChange={(e) =>
                                setNewProject({
                                  ...newProject,
                                  description: e.target.value,
                                })
                              }
                              placeholder="Describe your project"
                              rows={6}
                              className="h-24 resize-none rounded-xl border-input/50 font-geist shadow-none focus-visible:ring-primary/50 dark:border-gray-500/5"
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="settings" className="space-y-6">
                      <div className="rounded-xl border border-gray-100 bg-card p-4 dark:border-gray-500/5">
                        <h3 className="mb-4 font-geist text-lg font-medium">
                          Project Status
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label
                              htmlFor="status"
                              className="font-geist text-sm font-medium"
                            >
                              Status
                            </Label>
                            <Select
                              value={newProject.status}
                              onValueChange={(value) =>
                                setNewProject({
                                  ...newProject,
                                  status: value as
                                    | "ONGOING"
                                    | "COMPLETED"
                                    | "PAUSED"
                                    | "CANCELLED",
                                })
                              }
                            >
                              <SelectTrigger
                                id="status"
                                className="h-11 w-full rounded-xl border font-geist shadow-none dark:border-gray-500/5"
                              >
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border font-geist shadow-none dark:border-gray-500/5">
                                <SelectItem value="ONGOING">
                                  <div className="flex items-center">
                                    <div className="mr-2 h-2 w-2 rounded-full bg-blue-500"></div>
                                    Ongoing
                                  </div>
                                </SelectItem>
                                <SelectItem value="COMPLETED">
                                  <div className="flex items-center">
                                    <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                                    Completed
                                  </div>
                                </SelectItem>
                                <SelectItem value="PAUSED">
                                  <div className="flex items-center">
                                    <div className="mr-2 h-2 w-2 rounded-full bg-amber-500"></div>
                                    Paused
                                  </div>
                                </SelectItem>
                                <SelectItem value="CANCELLED">
                                  <div className="flex items-center">
                                    <div className="mr-2 h-2 w-2 rounded-full bg-red-500"></div>
                                    Cancelled
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor="access"
                              className="font-geist text-sm font-medium"
                            >
                              Access
                            </Label>
                            <Select
                              value={newProject.access}
                              onValueChange={(value) =>
                                setNewProject({
                                  ...newProject,
                                  access: value as "public" | "private",
                                })
                              }
                            >
                              <SelectTrigger
                                id="access"
                                className="h-11 w-full rounded-xl border font-geist shadow-none dark:border-gray-500/5"
                              >
                                <SelectValue placeholder="Select access" />
                              </SelectTrigger>
                              <SelectContent className="rounded-xl border font-geist shadow-none dark:border-gray-500/5">
                                <SelectItem value="public">
                                  <div className="flex items-center">
                                    <Globe className="mr-2 h-4 w-4 text-blue-500" />
                                    Public
                                  </div>
                                </SelectItem>
                                <SelectItem value="private">
                                  <div className="flex items-center">
                                    <Lock className="mr-2 h-4 w-4 text-amber-500" />
                                    Private
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-xl border border-gray-100 bg-card p-4 dark:border-gray-500/5">
                        <h3 className="mb-4 font-geist text-lg font-medium">
                          Categories
                        </h3>
                        <div className="space-y-4">
                          <div className="relative">
                            <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                            <Input
                              id="category"
                              placeholder="Type a category and press space"
                              onKeyDown={handleCategoryInput}
                              className="h-11 rounded-xl border pl-10 font-geist shadow-none dark:border-gray-500/5"
                            />
                          </div>

                          <div className="min-h-[100px] rounded-xl border bg-background/50 p-3 dark:border-gray-500/5">
                            {selectedCategories.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {selectedCategories.map((category) => (
                                  <Badge
                                    key={category}
                                    variant="secondary"
                                    className="group flex h-8 items-center gap-2 rounded-xl px-2 py-1 font-geist"
                                  >
                                    {category}
                                    <button
                                      type="button"
                                      className="text-muted-foreground transition-colors hover:text-foreground"
                                      onClick={() =>
                                        setSelectedCategories((prev) =>
                                          prev.filter((c) => c !== category),
                                        )
                                      }
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </Badge>
                                ))}
                              </div>
                            ) : (
                              <div className="flex h-full items-center justify-center font-geist text-sm text-muted-foreground">
                                <AlertCircle className="mr-2 h-4 w-4" />
                                No categories added yet
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="mt-8 flex justify-end gap-3 border-t pt-4 font-geist dark:border-gray-500/5">
                    <Button
                      variant="outline"
                      className="h-11 w-24 rounded-2xl"
                      onClick={() => setIsCreateModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateProject}
                      disabled={
                        !newProject.name ||
                        !newProject.description ||
                        isSubmitting
                      }
                      className="h-11 w-fit gap-2 rounded-2xl"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          Creating...
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4" />
                          Create Project
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs
        defaultValue="projects"
        className="w-full"
        onValueChange={(value) => setActiveTab(value)}
      >
        <div className="relative mb-6 flex w-full max-w-6xl flex-1 items-center justify-between">
          {/* Add gradient background effects */}
          <div className="absolute -bottom-20 -left-20 h-[200px] w-[200px] rotate-45 rounded-full bg-gradient-to-tl from-blue-300/10 via-blue-400/10 to-transparent blur-[80px]"></div>
          <div className="absolute -right-20 -top-20 h-[200px] w-[200px] -rotate-45 rounded-full bg-gradient-to-br from-orange-300/10 to-transparent blur-[80px]"></div>

          <TabsList className="relative z-10 flex h-12 justify-center rounded-full border border-gray-100 dark:border-gray-500/10 dark:bg-black">
            <TabsTrigger
              value="projects"
              className="h-10 rounded-full px-5 font-geist"
            >
              Project Board
            </TabsTrigger>
            <TabsTrigger
              value="leaderboard"
              className="h-10 rounded-full px-5 font-geist"
            >
              Leaderboard
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="projects">
          {isLoading && (
            <div className="min-w-6xl relative mx-auto h-52">
              <div className="absolute inset-0 flex flex-row items-center justify-center bg-gradient-to-br from-primary/5 via-transparent to-primary/5 blur-3xl"></div>
              <div className="grid grid-cols-3 gap-5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <ProjectCardSkeleton key={i} />
                ))}
              </div>
            </div>
          )}

          {!isLoading && filteredProjects?.length === 0 ? (
            <div className="relative flex w-full flex-col items-center justify-center py-12">
              {/* Add gradient background effects */}
              <div className="absolute -bottom-20 -left-20 h-[200px] w-[200px] rotate-45 rounded-full bg-gradient-to-tl from-blue-300/10 via-blue-400/10 to-transparent blur-[80px]"></div>
              <div className="absolute -right-20 -top-20 h-[200px] w-[200px] -rotate-45 rounded-full bg-gradient-to-br from-orange-300/10 to-transparent blur-[80px]"></div>

              <div className="relative z-10 text-center">
                <h3 className="text-lg font-medium">No projects found</h3>
                <p className="mt-1 text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            </div>
          ) : (
            <div className="relative grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {/* Add subtle gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 blur-3xl"></div>
              {filteredProjects?.map((project) => (
                <ProjectCard key={project.id} {...project} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="leaderboard">
          <LeaderboardPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
