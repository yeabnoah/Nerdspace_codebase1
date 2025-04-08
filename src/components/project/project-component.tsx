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
