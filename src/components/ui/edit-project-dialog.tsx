"use client";

import type React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
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
import ProjectInterface from "@/interface/auth/project.interface";
import { cn } from "@/lib/utils";
import { DialogTitle } from "@radix-ui/react-dialog";
import axios from "axios";
import { AlertCircle, Check, Globe, Lock, Tag, Upload, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

interface Project {
  name: string;
  description: string;
  image?: string;
  status: "ONGOING" | "COMPLETED" | "PAUSED" | "CANCELLED";
  access: "public" | "private";
  category: string[];
}

interface PartialProjectUpdate {
  name: string;
  description: string;
  category: string[];
  image: string;
}

interface EditProjectDialogProps {
  selectedImage: File | null;
  setSelectedImage: (image: File | null) => void;
  project: ProjectInterface;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSave: (updatedProjectData: Partial<ProjectInterface>) => void; // Updated to accept ProjectInterface
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
    setIsSubmitting(true);
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
        setIsSubmitting(false);
        return;
      }
    }

    const updatedProject: PartialProjectUpdate = {
      name: editedProject.name || project.name,
      description: editedProject.description || project.description,
      category: selectedCategories,
      image: imageUrl,
    };

    try {
      await onSave(updatedProject);
      onOpenChange(false);
    } catch (error) {
      console.error("Project update failed:", error);
    } finally {
      setIsSubmitting(false);
    }
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
        className="backdrop-blur-sm mx-4 mx-auto md:mx-0 p-0 border-none w-[94%] md:w-full max-w-4xl overflow-hidden"
        aria-describedby="edit-project-description"
      >
        <p id="edit-project-description font-geist" className="sr-only">
          Update your project details and settings.
        </p>
        <div className="relative flex md:flex-row flex-col h-[85vh] max-h-[85vh]">
          {/* Glow effects */}
          <div className="hidden md:block -right-4 absolute bg-gradient-to-br from-blue-300/40 via-blue-400/50 to-transparent backdrop-blur-sm blur-[150px] border border-blue-300/50 rounded-full size-32 -rotate-45"></div>
          <div className="hidden md:block -bottom-5 left-12 absolute bg-gradient-to-tl from-orange-300/40 via-orange-400/30 to-transparent backdrop-blur-sm blur-[150px] border border-orange-300/50 rounded-full size-32 rotate-45"></div>

          <DialogTitle></DialogTitle>
          <div className="flex flex-col dark:bg-black p-4 md:p-6 dark:border-gray-600/10 border-t border-r border-b border-l rounded-l-xl w-full md:w-1/3">
            <div className="mb-2 font-geist font-medium text-2xl md:text-3xl">
              Edit Project
            </div>
            <p className="mb-4 md:mb-6 font-geist text-muted-foreground text-sm md:text-base">
              Update your project details and settings
            </p>

            <div className="flex flex-col flex-1 justify-center items-center mt-4">
              <div className="relative bg-black mb-4 border-2 border-primary/20 border-dashed rounded-xl w-full max-w-[180px] md:max-w-[220px] aspect-square overflow-hidden">
                {selectedImage ? (
                  <img
                    src={
                      URL.createObjectURL(selectedImage) || "/placeholder.svg"
                    }
                    alt="Selected"
                    className="w-full h-full object-cover"
                  />
                ) : project.image ? (
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt="Project"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex justify-center items-center w-full h-full font-geist text-muted-foreground text-sm md:text-base">
                    No image
                  </div>
                )}
              </div>

              <div className="relative w-full max-w-[180px] md:max-w-[220px]">
                <Button
                  className="rounded-full w-full h-10 md:h-11 font-geist text-sm md:text-base"
                  type="button"
                >
                  <Upload className="mr-2 w-3.5 md:w-4 h-3.5 md:h-4" />
                  {project.image || selectedImage
                    ? "Change Image"
                    : "Upload Image"}
                </Button>
                <Input
                  type="file"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              {selectedImage && (
                <div className="mt-2 font-geist text-sm md:text-base">
                  <p>Selected Image: {selectedImage.name}</p>
                  <Button variant="outline" onClick={handleImageCancel} className="mt-2 text-sm md:text-base">
                    Remove Image
                  </Button>
                </div>
              )}
            </div>

            <div className="mt-auto pt-4 md:pt-6">
              <div className="mb-2 font-geist text-muted-foreground text-xs md:text-sm">
                Current Status
              </div>
              <div className="flex items-center">
                <div
                  className={cn(
                    "mr-2 size-2 rounded-full",
                    getStatusColor(editedProject?.status || project.status),
                  )}
                ></div>
                <span className="font-geist font-medium text-xs md:text-sm">
                  {editedProject?.status || project.status}
                </span>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="flex-1 p-4 md:p-6 overflow-y-auto">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 mb-4 md:mb-6 rounded-full w-full h-10 md:h-12">
                <TabsTrigger
                  value="details"
                  className="rounded-full h-8 md:h-10 font-geist text-sm md:text-base"
                >
                  Project Details
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="rounded-full h-8 md:h-10 font-geist text-sm md:text-base"
                >
                  Settings & Categories
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="space-y-4 md:space-y-6">
                <div className="bg-card shadow-none p-3 md:p-4 border border-gray-100 dark:border-gray-500/5 rounded-xl">
                  <h3 className="mb-3 md:mb-4 font-geist font-medium text-base md:text-lg">
                    Basic Information
                  </h3>

                  <div className="space-y-3 md:space-y-4">
                    <div className="space-y-1.5 md:space-y-2">
                      <Label
                        htmlFor="name"
                        className="font-geist font-medium text-xs md:text-sm"
                      >
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
                        className="shadow-none border-input/50 dark:border-gray-500/5 rounded-xl focus-visible:ring-primary/50 h-9 md:h-11 font-geist text-sm md:text-base"
                      />
                    </div>

                    <div className="space-y-1.5 md:space-y-2">
                      <Label
                        htmlFor="description"
                        className="font-geist font-medium text-xs md:text-sm"
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
                        rows={4}
                        className="shadow-none border-input/50 dark:border-gray-500/5 rounded-xl focus-visible:ring-primary/50 h-20 md:h-24 font-geist text-sm md:text-base resize-none"
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="settings" className="space-y-4 md:space-y-6">
                <div className="bg-card p-3 md:p-4 border border-gray-100 dark:border-gray-500/5 rounded-xl">
                  <h3 className="mb-3 md:mb-4 font-geist font-medium text-base md:text-lg">
                    Project Status
                  </h3>

                  <div className="gap-3 md:gap-4 grid grid-cols-1 md:grid-cols-2">
                    <div className="space-y-1.5 md:space-y-2">
                      <Label
                        htmlFor="status"
                        className="font-geist font-medium text-xs md:text-sm"
                      >
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
                        <SelectTrigger
                          id="status"
                          className="shadow-none border dark:border-gray-500/5 rounded-xl w-full h-9 md:h-11 font-geist text-sm md:text-base"
                        >
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent
                          className={`rounded-xl border font-geist text-sm md:text-base shadow-none dark:border-gray-500/5`}
                        >
                          <SelectItem
                            value="ONGOING"
                            className="flex items-center"
                          >
                            <div className="flex items-center">
                              <div className="bg-blue-500 mr-2 rounded-full w-2 h-2"></div>
                              Ongoing
                            </div>
                          </SelectItem>
                          <SelectItem value="COMPLETED">
                            <div className="flex items-center">
                              <div className="bg-green-500 mr-2 rounded-full w-2 h-2"></div>
                              Completed
                            </div>
                          </SelectItem>
                          <SelectItem value="PAUSED">
                            <div className="flex items-center">
                              <div className="bg-amber-500 mr-2 rounded-full w-2 h-2"></div>
                              Paused
                            </div>
                          </SelectItem>
                          <SelectItem value="CANCELLED">
                            <div className="flex items-center">
                              <div className="bg-red-500 mr-2 rounded-full w-2 h-2"></div>
                              Cancelled
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1.5 md:space-y-2">
                      <Label
                        htmlFor="access"
                        className="font-geist font-medium text-xs md:text-sm"
                      >
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
                        <SelectTrigger
                          id="access"
                          className="shadow-none border dark:border-gray-500/5 rounded-xl w-full h-9 md:h-11 font-geist text-sm md:text-base"
                        >
                          <SelectValue placeholder="Select access" />
                        </SelectTrigger>
                        <SelectContent
                          className={`rounded-xl border font-geist text-sm md:text-base shadow-none dark:border-gray-500/5`}
                        >
                          <SelectItem value="public">
                            <div className="flex items-center">
                              <Globe className="mr-2 w-3.5 md:w-4 h-3.5 md:h-4 text-blue-500" />
                              Public
                            </div>
                          </SelectItem>
                          <SelectItem value="private">
                            <div className="flex items-center">
                              <Lock className="mr-2 w-3.5 md:w-4 h-3.5 md:h-4 text-amber-500" />
                              Private
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="bg-card p-3 md:p-4 border border-gray-100 dark:border-gray-500/5 rounded-xl">
                  <h3 className="mb-3 md:mb-4 font-geist font-medium text-base md:text-lg">
                    Categories
                  </h3>

                  <div className="space-y-3 md:space-y-4">
                    <div className="relative">
                      <Tag className="top-1/2 left-3 absolute w-3.5 md:w-4 h-3.5 md:h-4 text-muted-foreground -translate-y-1/2 transform" />
                      <Input
                        id="category"
                        placeholder="Type a category and press Enter or Space"
                        onKeyDown={handleCategoryInput}
                        className="shadow-none pl-9 md:pl-10 border dark:border-gray-500/5 rounded-xl h-9 md:h-11 font-geist text-sm md:text-base"
                      />
                    </div>

                    <div className="bg-background/50 p-2 md:p-3 border dark:border-gray-500/5 rounded-xl min-h-[80px] md:min-h-[100px]">
                      {selectedCategories.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5 md:gap-2">
                          {selectedCategories.map((category) => (
                            <Badge
                              key={category}
                              variant="secondary"
                              className="group flex items-center gap-1.5 md:gap-2 px-2 py-1 rounded-xl h-7 md:h-8 font-geist text-xs md:text-sm"
                            >
                              {category}
                              <button
                                type="button"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                                onClick={() => handleRemoveCategory(category)}
                              >
                                <X className="w-2.5 md:w-3 h-2.5 md:h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <div
                          className={`flex h-full items-center justify-center font-geist text-xs md:text-sm text-muted-foreground`}
                        >
                          <AlertCircle className="mr-2 w-3.5 md:w-4 h-3.5 md:h-4" />
                          No categories added yet
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div
              className={`mt-6 md:mt-8 flex justify-end gap-2 md:gap-3 border-t pt-3 md:pt-4 font-geist dark:border-gray-500/5`}
            >
              <Button
                variant="outline"
                className="rounded-2xl w-20 md:w-24 h-9 md:h-11 text-sm md:text-base"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleEditProject}
                className="gap-1.5 md:gap-2 rounded-2xl w-fit h-9 md:h-11 text-sm md:text-base"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="border-2 border-current border-t-transparent rounded-full w-3.5 md:w-4 h-3.5 md:h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Check className="w-3.5 md:w-4 h-3.5 md:h-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
