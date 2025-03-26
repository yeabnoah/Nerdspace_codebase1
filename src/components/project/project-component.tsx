"use client";

import { useState } from "react";
import { Plus, Search, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import ProjectCard from "./project-card";

const mockProjects = [
  {
    id: "1",
    name: "Hope Music",
    description:
      "A tool that generates images using AI models with advanced style transfer capabilities and custom training options.",
    status: "ONGOING",
    category: ["AI", "Machine Learning", "Computer Vision"],
    createdAt: new Date("2023-01-15"),
    image: "music.jpg?q=80&w=1000",
    user: {
      name: "John Doe",
      image: "/placeholder.svg?height=40&width=40",
    },
    _count: {
      stars: 43,
      followers: 15,
    },
  },
  {
    id: "2",
    name: "Gwax Photography",
    description:
      "A full-featured e-commerce solution with payment integration, inventory management, and analytics dashboard.",
    status: "COMPLETED",
    category: ["Web Development", "E-commerce", "Fintech"],
    createdAt: new Date("2023-03-22"),
    image: "gwax.jpg?q=80&w=1000",
    user: {
      name: "Jane Smith",
      image: "/placeholder.svg?height=40&width=40",
    },
    _count: {
      stars: 56,
      followers: 32,
    },
  },
  {
    id: "3",
    name: "Shalom Collection",
    description:
      "A productivity app for managing tasks and projects with team collaboration features and progress tracking.",
    status: "ONGOING",
    category: ["Productivity", "Mobile App", "SaaS"],
    createdAt: new Date("2023-05-10"),
    image: "art.jpg?q=80&w=1000",
    user: {
      name: "Alex Johnson",
      image: "/placeholder.svg?height=40&width=40",
    },
    _count: {
      stars: 38,
      followers: 9,
    },
  },
  {
    id: "4",
    name: "Miro Robot project",
    description:
      "Analytics dashboard for social media accounts with content scheduling and performance metrics visualization.",
    status: "PAUSED",
    category: ["Analytics", "Social Media", "Marketing"],
    createdAt: new Date("2023-02-05"),
    image: "robot.jpg?q=80&w=1000",
    user: {
      name: "Sarah Williams",
      image: "/placeholder.svg?height=40&width=40",
    },
    _count: {
      stars: 37,
      followers: 21,
    },
  },
  {
    id: "5",
    name: "Shemane shirt",
    description:
      "Mobile app for tracking workouts and nutrition with personalized recommendations and progress visualization.",
    status: "ONGOING",
    category: ["Health", "Mobile App", "IoT"],
    createdAt: new Date("2023-04-18"),
    image: "fashion.jpg?q=80&w=1000",
    user: {
      name: "Michael Brown",
      image: "/placeholder.svg?height=40&width=40",
    },
    _count: {
      stars: 42,
      followers: 28,
    },
  },

  {
    id: "7",
    name: "Deep AI",
    description:
      "Secure wallet for cryptocurrency transactions with multi-signature support and real-time market data integration.",
    status: "ONGOING",
    category: ["Blockchain", "Fintech", "Cryptocurrency"],
    createdAt: new Date("2023-06-05"),
    image:
      "https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=1000",
    user: {
      name: "David Wilson",
      image: "/placeholder.svg?height=40&width=40",
    },
    _count: {
      stars: 45,
      followers: 47,
    },
  },
  {
    id: "8",
    name: "Adawa Game",
    description:
      "Immersive VR gaming experience with realistic physics, multiplayer capabilities, and cross-platform compatibility.",
    status: "PAUSED",
    category: ["Gaming", "VR", "3D Modeling"],
    createdAt: new Date("2023-03-12"),
    image: "?q=80&w=1000",
    user: {
      name: "Olivia Martinez",
      image: "/placeholder.svg?height=40&width=40",
    },
    _count: {
      stars: 39,
      followers: 16,
    },
  },
];

const categoryOptions = [
  "Web Development",
  "Mobile App",
  "AI",
  "Machine Learning",
  "Data Science",
  "E-commerce",
  "Productivity",
  "Social Media",
  "Analytics",
  "IoT",
  "Blockchain",
  "Gaming",
  "VR",
  "Health",
  "Fintech",
  "Smart Home",
  "3D Modeling",
  "Cryptocurrency",
  "SaaS",
  "Marketing",
  "Computer Vision",
];

const sampleImages = [
  "https://images.unsplash.com/photo-1617791160505-6f00504e3519?q=80&w=1000",
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=1000",
  "https://images.unsplash.com/photo-1540350394557-8d14678e7f91?q=80&w=1000",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1000",
  "https://images.unsplash.com/photo-1576678927484-cc907957088c?q=80&w=1000",
  "https://images.unsplash.com/photo-1558002038-bb0237f4e204?q=80&w=1000",
];

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    status: "ONGOING",
    category: [],
    access: "private",
    image: "",
  });
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [projects, setProjects] = useState(mockProjects);
  const [selectedImage, setSelectedImage] = useState("");

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      project.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleCreateProject = () => {
    // Create a new project with dummy data
    const newProjectData = {
      id: `${projects.length + 1}`,
      name: newProject.name,
      description: newProject.description,
      status: newProject.status,
      category: selectedCategories,
      createdAt: new Date(),
      image:
        selectedImage ||
        `https://images.unsplash.com/photo-1617791160505-6f00504e3519?q=80&w=1000`,
      user: {
        name: "Current User",
        image: "/placeholder.svg?height=40&width=40",
      },
      _count: {
        stars: 0,
        followers: 0,
      },
    };

    // Add the new project to the list
    setProjects([newProjectData, ...projects]);

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
    setSelectedImage("");
    setIsCreateModalOpen(false);
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
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
                        onChange={() => {
                          // In a real app, you would handle file upload here
                          // For this demo, we'll just use a placeholder
                          setSelectedImage(
                            `https://images.unsplash.com/photo-1639762681057-408e52192e55?q=80&w=1000`,
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={newProject.status}
                    onValueChange={(value) =>
                      setNewProject({ ...newProject, status: value })
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
                      setNewProject({ ...newProject, access: value })
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

      {filteredProjects.length === 0 ? (
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
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
