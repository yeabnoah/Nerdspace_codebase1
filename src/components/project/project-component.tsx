"use client";

import { Button } from "@/components/ui/button";
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
import { Plus, Search, Upload, Check, X, Globe, Lock, Tag } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectInterface, {
  ProjectInterfaceToSubmit,
} from "@/interface/auth/project.interface";
import { queryClient } from "@/providers/tanstack-query-provider";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { ProjectCardSkeleton } from "../skeleton/project-card";
import ProjectCard from "./project-card";
import LeaderboardPage from "./leaderBorad";

const cloudinaryUploadUrl = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL!;
const cloudinaryUploadPreset =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
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
    isError,
  } = useQuery<ProjectInterface[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await axios.get("/api/project");
      setProjects(response.data.data);
      return response.data.data;
    },
  });

  const mutation = useMutation({
    mutationKey: ["create-project"],
    mutationFn: async (newProjectData) => {
      const response = await axios.post("/api/project", newProjectData);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Project successfully created");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
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
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while updating the project";
      toast.error(errorMessage);
    },
  });

  const deleteMutation = useMutation({
    mutationKey: ["delete-project"],
    mutationFn: async (projectId) => {
      const response = await axios.delete("/api/project", {
        data: { id: projectId },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Project successfully deleted");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message ||
        "An error occurred while deleting the project";
      toast.error(errorMessage);
    },
  });

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

    await mutation.mutate(newProjectData as any);

    // Reset form and close modal
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
  };

  const handleUpdateProject = async () => {
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
        return;
      }
    }

    const updatedProjectData: ProjectInterfaceToSubmit = {
      name: newProject.name,
      description: newProject.description,
      status: newProject.status,
      category: selectedCategories,
      access: newProject.access,
      image: imageUrl || newProject.image,
    };

    await updateMutation.mutate(updatedProjectData as any);

    // Reset form and close modal
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
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
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

  return (
    <div className="container mx-auto py-2 px-8 bg-white dark:bg-black">
      
      
      <div className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <h1 className="font-instrument text-4xl">Projects</h1>

        <div className="flex w-full flex-col gap-4 sm:flex-row md:w-auto">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search projects..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 h-4 w-4" />
                Create Project
              </Button>
            </DialogTrigger>
            <DialogContent
              className="max-w-4xl overflow-hidden rounded-xl border-none p-0 shadow-xl"
              aria-describedby="create-project-description"
            >
              <p id="create-project-description" className="sr-only">
                Fill in the details to create a new project.
              </p>
              <div className="flex h-[85vh] max-h-[85vh] flex-col md:flex-row">
                <DialogTitle></DialogTitle>
                <div className="flex w-full flex-col bg-gradient-to-b from-primary/10 to-primary/5 p-6 md:w-1/3">
                  <div className="mb-2 font-instrument text-3xl">
                    New Project
                  </div>
                  <p className="mb-6 text-muted-foreground">
                    Fill in the details to create a new project.
                  </p>

                  <div className="mt-4 flex flex-1 flex-col items-center justify-center">
                    <div className="relative mb-4 aspect-square w-full max-w-[220px] overflow-hidden rounded-xl border-2 border-dashed border-primary/20 bg-background/50">
                      {selectedImage ? (
                        <img
                          src={URL.createObjectURL(selectedImage)}
                          alt="Selected"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="relative w-full max-w-[220px]">
                      <Button
                        variant="outline"
                        className="w-full"
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
                      <div className="mt-2 w-full">
                        <Button
                          variant="outline"
                          className=" w-[87%] ml-4"
                          onClick={handleImageCancel}
                        >
                          Remove Image
                        </Button>

                        <p className="text-wrap my-2 text-xs">
                          {selectedImage.name}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                  <Tabs defaultValue="details" className="w-full">
                    <TabsList className="mb-6 grid w-full grid-cols-2">
                      <TabsTrigger value="details">Project Details</TabsTrigger>
                      <TabsTrigger value="settings">
                        Settings & Categories
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="details" className="space-y-6">
                      <div className="rounded-lg border bg-card p-4 shadow-sm">
                        <h3 className="mb-4 text-lg font-medium">
                          Basic Information
                        </h3>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label
                              htmlFor="name"
                              className="text-sm font-medium"
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
                              className="border-input/50 focus-visible:ring-primary/50"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label
                              htmlFor="description"
                              className="text-sm font-medium"
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
                              className="resize-none border-input/50 focus-visible:ring-primary/50"
                            />
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="settings" className="space-y-6">
                      <div className="rounded-lg border bg-card p-4 shadow-sm">
                        <h3 className="mb-4 text-lg font-medium">
                          Project Settings
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label
                              htmlFor="status"
                              className="text-sm font-medium"
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
                              <SelectTrigger id="status" className="w-full">
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
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
                              className="text-sm font-medium"
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
                              <SelectTrigger id="access" className="w-full">
                                <SelectValue placeholder="Select access" />
                              </SelectTrigger>
                              <SelectContent>
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

                      <div className="rounded-lg border bg-card p-4 shadow-sm">
                        <h3 className="mb-4 text-lg font-medium">Categories</h3>
                        <div className="space-y-4">
                          <div className="relative">
                            <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                            <Input
                              id="category"
                              placeholder="Type a category and press space"
                              onKeyDown={handleCategoryInput}
                              className="pl-10"
                            />
                          </div>

                          <div className="min-h-[100px] rounded-md border bg-background/50 p-3">
                            {selectedCategories.length > 0 ? (
                              <div className="flex flex-wrap gap-2">
                                {selectedCategories.map((category) => (
                                  <Badge
                                    key={category}
                                    variant="secondary"
                                    className="group flex items-center gap-1 px-2 py-1"
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
                              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                                No categories added yet
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="mt-8 flex justify-end gap-3 border-t pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateProject}
                      disabled={!newProject.name || !newProject.description}
                      className="gap-2"
                    >
                      <Check className="h-4 w-4" />
                      Create Project
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
        className="w-fit"
        onValueChange={(value) => setActiveTab(value)}
      >
        <div className="mb-6 flex items-center justify-between relative">
          {/* Add gradient background effects */}
          <div className="absolute -bottom-20 -left-20 h-[200px] w-[200px] rotate-45 rounded-full bg-gradient-to-tl from-blue-300/10 via-blue-400/10 to-transparent blur-[80px]"></div>
          <div className="absolute -right-20 -top-20 h-[200px] w-[200px] -rotate-45 rounded-full bg-gradient-to-br from-orange-300/10 to-transparent blur-[80px]"></div>
          
          <TabsList className="flex w-fit justify-center relative z-10">
            <TabsTrigger value="projects">Project Board</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <div className="font-instrument text-2xl relative z-10">
            {activeTab === "projects" ? "Project Board" : "Leaderboard"}
          </div>
        </div>

        <TabsContent value="projects">
          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative">
              {/* Add subtle gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 blur-3xl"></div>
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <ProjectCardSkeleton key={i} />
              ))}
            </div>
          )}

          {!isLoading && filteredProjects?.length === 0 ? (
            <div className="flex w-full flex-col items-center justify-center py-12 relative">
              {/* Add gradient background effects */}
              <div className="absolute -bottom-20 -left-20 h-[200px] w-[200px] rotate-45 rounded-full bg-gradient-to-tl from-blue-300/10 via-blue-400/10 to-transparent blur-[80px]"></div>
              <div className="absolute -right-20 -top-20 h-[200px] w-[200px] -rotate-45 rounded-full bg-gradient-to-br from-orange-300/10 to-transparent blur-[80px]"></div>
              
              <div className="text-center relative z-10">
                <h3 className="text-lg font-medium">No projects found</h3>
                <p className="mt-1 text-muted-foreground">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 relative">
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
