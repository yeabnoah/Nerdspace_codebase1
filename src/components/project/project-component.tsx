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
  X,
  Loader2
} from "lucide-react";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { ProjectCardSkeleton } from "../skeleton/project-card";
import LeaderboardPage from "./leaderBorad";
import ProjectCard from "./project-card";
import { usePostHog } from 'posthog-js/react';

const cloudinaryUploadUrl = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL!;
const cloudinaryUploadPreset =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

export default function ProjectsPage() {
  const posthog = usePostHog();
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
    refetch,
  } = useQuery<ProjectInterface[]>({
    queryKey: ["projects"],
    queryFn: async () => {
      const response = await axios.get("/api/project");
      setProjects(response.data.data);
      return response.data.data;
    },
    refetchOnMount: true,
    staleTime: 1000 * 30, // 30 seconds
  });

  // Effect to update projects state when data is available and refetch when component mounts
  useEffect(() => {
    if (projecter) {
      setProjects(projecter);
    }
    // Refetch data on component mount
    refetch();
  }, [projecter, refetch]);

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
        error.message ||
        "An error occurred while creating the project";
      toast.error(errorMessage as string);
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
        error.message ||
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

  // Track page visit
  useEffect(() => {
    if (posthog) {
      posthog.capture('projects_page_view', {
        activeTab,
        source: 'project-component'
      });
    }
  }, [posthog, activeTab]);

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex sm:flex-row flex-col sm:justify-between sm:items-center gap-4">
        <h1 className="font-semibold text-2xl sm:text-3xl">Projects</h1>
        <div className="flex sm:flex-row flex-col sm:items-center gap-2 sm:gap-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              <SelectItem value="ongoing">Ongoing</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="on-hold">On Hold</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
                <Plus className="mr-2 w-4 h-4" />
                Create Project
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogTitle>Create New Project</DialogTitle>
              <div className="space-y-4 mt-4">
                          <div className="space-y-2">
                  <Label htmlFor="name">Project Name</Label>
                            <Input
                              id="name"
                              value={newProject.name}
                              onChange={(e) =>
                      setNewProject({ ...newProject, name: e.target.value })
                              }
                              placeholder="Enter project name"
                            />
                          </div>

                          <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                            <Textarea
                              id="description"
                              value={newProject.description}
                              onChange={(e) =>
                                setNewProject({
                                  ...newProject,
                                  description: e.target.value,
                                })
                              }
                    placeholder="Enter project description"
                    className="min-h-[100px]"
                            />
                          </div>

                          <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                            <Select
                              value={newProject.status}
                    onValueChange={(value: "ONGOING" | "COMPLETED" | "PAUSED" | "CANCELLED") =>
                      setNewProject({ ...newProject, status: value })
                    }
                  >
                    <SelectTrigger>
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

                          <div className="space-y-2">
                  <Label htmlFor="access">Access</Label>
                            <Select
                              value={newProject.access}
                    onValueChange={(value: "public" | "private") =>
                      setNewProject({ ...newProject, access: value })
                    }
                  >
                    <SelectTrigger>
                                <SelectValue placeholder="Select access" />
                              </SelectTrigger>
                    <SelectContent>
                                <SelectItem value="public">
                        <div className="flex items-center gap-2">
                          <Globe className="w-4 h-4" />
                                    Public
                                  </div>
                                </SelectItem>
                                <SelectItem value="private">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4" />
                                    Private
                                  </div>
                                </SelectItem>
                              </SelectContent>
                            </Select>
                      </div>

                <div className="space-y-2">
                  <Label>Categories</Label>
                              <div className="flex flex-wrap gap-2">
                    {selectedCategories.map((category, index) => (
                                  <Badge
                        key={index}
                                    variant="secondary"
                        className="flex items-center gap-1"
                                  >
                                    {category}
                                    <button
                                      onClick={() =>
                            setSelectedCategories(
                              selectedCategories.filter((_, i) => i !== index)
                                        )
                                      }
                          className="hover:bg-muted ml-1 p-0.5 rounded-full"
                                    >
                          <X className="w-3 h-3" />
                                    </button>
                                  </Badge>
                                ))}
                  </div>
                  <Input
                    placeholder="Add a category and press Enter"
                    onKeyDown={handleCategoryInput}
                    className="mt-2"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Project Image</Label>
                  <div className="flex sm:flex-row flex-col sm:items-center gap-4">
                    {selectedImage ? (
                      <div className="relative w-full sm:w-48 h-32">
                        <img
                          src={URL.createObjectURL(selectedImage)}
                          alt="Selected"
                          className="rounded-lg w-full h-full object-cover"
                        />
                        <button
                          onClick={handleImageCancel}
                          className="-top-2 -right-2 absolute bg-destructive hover:bg-destructive/90 p-1 rounded-full text-white"
                        >
                          <X className="w-4 h-4" />
                        </button>
                              </div>
                            ) : (
                      <div className="flex justify-center items-center border-2 border-muted-foreground/25 border-dashed rounded-lg w-full sm:w-48 h-32">
                        <Upload className="w-8 h-8 text-muted-foreground" />
                              </div>
                            )}
                    <div className="flex flex-col gap-2">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="w-full"
                      />
                      <p className="text-muted-foreground text-xs">
                        Recommended size: 1200x630px
                      </p>
                          </div>
                        </div>
                      </div>

                <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateModalOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateProject}
                    disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                        <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                      "Create Project"
                      )}
                    </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs
        defaultValue="projects"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="projects" className="flex-1 sm:flex-none">
            Projects
            </TabsTrigger>
          <TabsTrigger value="leaderboard" className="flex-1 sm:flex-none">
              Leaderboard
            </TabsTrigger>
          </TabsList>

        <TabsContent value="projects" className="mt-6">
          {isLoading ? (
            <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, index) => (
                <ProjectCardSkeleton key={index} />
              ))}
            </div>
          ) : filteredProjects?.length === 0 ? (
            <div className="flex flex-col justify-center items-center p-8 border border-dashed rounded-lg text-center">
              <AlertCircle className="mb-4 w-12 h-12 text-muted-foreground" />
              <h3 className="mb-2 font-semibold text-lg">No projects found</h3>
              <p className="mb-4 text-muted-foreground text-sm">
                Create your first project to get started
              </p>
              <Button onClick={() => setIsCreateModalOpen(true)} className="py-5 w-full">
                <Plus className="mr-2 w-4 h-4" />
                Create Project
              </Button>
            </div>
          ) : (
            <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProjects?.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onUpdate={() => {
                    // Handle update
                  }}
                  onDelete={() => {
                    // Handle delete
                  }}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="leaderboard" className="mt-6">
          <LeaderboardPage />
        </TabsContent>
      </Tabs>
    </div>
  );
}
