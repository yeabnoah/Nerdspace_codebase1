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
import { Plus, Search, Upload } from "lucide-react";
import { useState } from "react";
// import ProjectCard, { ProjectCardSkeleton } from "./project-card";
import ProjectInterface, {
  ProjectInterfaceToSubmit,
} from "@/interface/auth/project.interface";
import { queryClient } from "@/providers/tanstack-query-provider";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import { ProjectCardSkeleton } from "../skeleton/project-card";
import ProjectCard from "./project-card";

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
  const { data: projecter, isLoading } = useQuery<ProjectInterface[]>({
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
    <div className="container mx-auto py-8">
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
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Create New Project</DialogTitle>
                <DialogDescription>
                  Fill in the details to create a new project. Click save when
                  you're done.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
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

                <div className="grid gap-2">
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
                    placeholder="Describe your project"
                    rows={4}
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Project Image</Label>
                  <div className="mt-2 flex items-center justify-center">
                    <div className="relative h-10 w-full">
                      <Button
                        variant="outline"
                        className="w-full"
                        type="button"
                      >
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
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
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
                    value={newProject.access}
                    onValueChange={(value) =>
                      setNewProject({
                        ...newProject,
                        access: value as "public" | "private",
                      })
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
                    {selectedCategories.map((category) => (
                      <span
                        key={category}
                        className="rounded-full bg-white px-2 py-1 text-xs dark:bg-white/50 dark:text-black"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateProject}
                  disabled={!newProject.name || !newProject.description}
                >
                  Create Project
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-rows-3 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && filteredProjects?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-lg font-medium">No projects found</h3>
            <p className="mt-1 text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-rows-3 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects?.map((project) => (
            <ProjectCard key={project.id} {...project} />
          ))}
        </div>
      )}
    </div>
  );
}
