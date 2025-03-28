"use client";

import type React from "react";

import { useState } from "react";
import { Upload, X, Check, AlertCircle, Globe, Lock, Tag } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { DialogTitle } from "@radix-ui/react-dialog";
import axios from "axios";
import toast from "react-hot-toast";

interface Project {
  name: string;
  description: string;
  image?: string;
  status: "ONGOING" | "COMPLETED" | "PAUSED" | "CANCELLED";
  access: "public" | "private";
  category: string[];
}

interface EditProjectDialogProps {
  selectedImage: File | null;
  setSelectedImage: (image: File | null) => void;
  project: Project;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (updatedProjectData: Partial<Project>) => void;
}

export function EditProjectDialog({
  project,
  isOpen,
  onOpenChange,
  onSave,
  selectedImage,
  setSelectedImage,
}: EditProjectDialogProps) {
  const [editedProject, setEditedProject] = useState<Partial<Project>>({});
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    project.category || [],
  );
  const [activeTab, setActiveTab] = useState("details");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const handleImageCancel = () => {
    setSelectedImage(null);
  };

  const handleCategoryInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      const input = e.currentTarget;
      const value = input.value.trim();

      if (value && !selectedCategories.includes(value)) {
        setSelectedCategories([...selectedCategories, value]);
      }

      input.value = "";
    }
  };

  const handleRemoveCategory = (category: string) => {
    setSelectedCategories(selectedCategories.filter((c) => c !== category));
  };

  const handleEditProject = async () => {
    let imageUrl = project.image;

    if (selectedImage && selectedImage instanceof File) {
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

    const updatedProject = {
      ...editedProject,
      name: editedProject.name || project.name,
      description: editedProject.description || project.description,
      category: selectedCategories,
      image: imageUrl, // Ensure the uploaded image URL is included
    };

    onSave(updatedProject); // Pass the updated project with the image URL
    onOpenChange(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ONGOING":
        return "bg-blue-500";
      case "COMPLETED":
        return "bg-green-500";
      case "PAUSED":
        return "bg-amber-500";
      case "CANCELLED":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="hidden">Open Dialog</Button>
      </DialogTrigger>
      <DialogContent
        className="max-w-4xl overflow-hidden rounded-xl border-none p-0"
        aria-describedby="edit-project-description"
      >
        <p id="edit-project-description" className="sr-only">
          Update your project details and settings.
        </p>
        <div className="flex h-[85vh] max-h-[85vh] flex-col md:flex-row">
        <DialogTitle></DialogTitle>
          <div className="flex w-full flex-col bg-gradient-to-b from-primary/10 to-primary/5 p-6 md:w-1/3">
            <div className="mb-2 font-instrument text-3xl">Edit Project</div>
            <p className="mb-6 text-muted-foreground">
              Update your project details and settings
            </p>

            <div className="mt-4 flex flex-1 flex-col items-center justify-center">
              <div className="relative mb-4 aspect-square w-full max-w-[220px] overflow-hidden rounded-xl border-2 border-dashed border-primary/20 bg-background/50">
                {selectedImage ? (
                  <img
                    src={
                      URL.createObjectURL(selectedImage) || "/placeholder.svg"
                    }
                    alt="Selected"
                    className="h-full w-full object-cover"
                  />
                ) : project.image ? (
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt="Project"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    No image
                  </div>
                )}
              </div>

              <div className="relative w-full max-w-[220px]">
                <Button variant="outline" className="w-full" type="button">
                  <Upload className="mr-2 h-4 w-4" />
                  {project.image || selectedImage
                    ? "Change Image"
                    : "Upload Image"}
                </Button>
                <Input
                  type="file"
                  className="absolute inset-0 cursor-pointer opacity-0"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              {selectedImage && (
                <div className="mt-2">
                  <p>Selected Image: {selectedImage.name}</p>
                  <Button variant="outline" onClick={handleImageCancel}>
                    Remove Image
                  </Button>
                </div>
              )}
            </div>

            <div className="mt-auto pt-6">
              <div className="mb-2 text-sm text-muted-foreground">
                Current Status
              </div>
              <div className="flex items-center">
                <div
                  className={cn(
                    "mr-2 size-2 rounded-full",
                    getStatusColor(editedProject?.status || project.status),
                  )}
                ></div>
                <span className="font-medium text-xs">
                  {editedProject?.status || project.status}
                </span>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 overflow-y-auto p-6">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="mb-6 grid w-full grid-cols-2">
                <TabsTrigger value="details">Project Details</TabsTrigger>
                <TabsTrigger value="settings">
                  Settings & Categories
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-6">
                <div className="rounded-lg border dark:border-gray-500/5 border-gray-100 shadow-none bg-card p-4">
                  <h3 className="mb-4 text-lg font-medium">
                    Basic Information
                  </h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-medium">
                        Project Name
                      </Label>
                      <Input
                        id="name"
                        value={
                          editedProject?.name !== undefined
                            ? editedProject.name
                            : project.name
                        }
                        onChange={(e) =>
                          setEditedProject((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Enter project name"
                        className="border-input/50 dark:border-gray-500/5 shadow-none focus-visible:ring-primary/50"
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
                        value={
                          editedProject?.description !== undefined
                            ? editedProject.description
                            : project.description
                        }
                        onChange={(e) =>
                          setEditedProject((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Describe your project"
                        rows={6}
                        className="resize-none border-input/50 shadow-none dark:border-gray-500/5 focus-visible:ring-primary/50"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6">
                <div className="rounded-lg border dark:border-gray-500/5  border-gray-100 bg-card p-4">
                  <h3 className="mb-4 text-lg font-medium">Project Status</h3>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="status" className="text-sm font-medium">
                        Status
                      </Label>
                      <Select
                        value={editedProject?.status || project.status}
                        onValueChange={(value) =>
                          setEditedProject((prev) => ({
                            ...prev,
                            status: value as
                              | "ONGOING"
                              | "COMPLETED"
                              | "PAUSED"
                              | "CANCELLED",
                          }))
                        }
                      >
                        <SelectTrigger id="status" className="w-full shadow-none border dark:border-gray-500/5">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent className=" border shadow-none dark:border-gray-500/5">
                          <SelectItem
                            value="ONGOING"
                            className="flex items-center"
                          >
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
                      <Label htmlFor="access" className="text-sm font-medium">
                        Access
                      </Label>
                      <Select
                        value={editedProject?.access || project.access}
                        onValueChange={(value) =>
                          setEditedProject((prev) => ({
                            ...prev,
                            access: value as "public" | "private",
                          }))
                        }
                      >
                        <SelectTrigger id="access" className="w-full shadow-none border dark:border-gray-500/5">
                          <SelectValue placeholder="Select access" />
                        </SelectTrigger>
                        <SelectContent className=" dark:border-gray-500/5 border shadow-none">
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

                <div className="rounded-lg border dark:border-gray-500/5 bg-card border-gray-100 p-4 ">
                  <h3 className="mb-4 text-lg font-medium">Categories</h3>

                  <div className="space-y-4">
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
                      <Input
                        id="category"
                        placeholder="Type a category and press Enter or Space"
                        onKeyDown={handleCategoryInput}
                        className="pl-10 border dark:border-gray-500/5 shadow-none"
                      />
                    </div>

                    <div className="min-h-[100px] rounded-md border dark:border-gray-500/5 bg-background/50 p-3">
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
                                onClick={() => handleRemoveCategory(category)}
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                          <AlertCircle className="mr-2 h-4 w-4" />
                          No categories added yet
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="mt-8 flex justify-end gap-3 border-t dark:border-gray-500/5 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleEditProject} className="gap-2">
                <Check className="h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
