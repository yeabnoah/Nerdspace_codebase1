<<<<<<< HEAD
"use client";

import type React from "react";

import { useState } from "react";
import type { CommunityInterface } from "@/interface/auth/community.interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface CreateCommunityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: Partial<CommunityInterface>) => void;
  isLoading: boolean;
  categories: any[];
}

export function CreateCommunityDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  categories,
}: CreateCommunityDialogProps) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    image: "",
    categoryId: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
=======
"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCreateCommunityMutation } from "@/hooks/use-communities"
import { useToastNotifications } from "@/hooks/use-toast-notifications"
import { Loader2 } from "lucide-react"
import { useState } from "react"

interface CreateCommunityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function CreateCommunityDialog({ open, onOpenChange }: CreateCommunityDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")

  // Use the mutation hook
  const createCommunityMutation = useCreateCommunityMutation()
  const toast = useToastNotifications()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    createCommunityMutation.mutate(
      {
        name,
        description,
        image: image || undefined,
      },
      {
        onSuccess: () => {
          toast.communityCreated()
          onOpenChange(false)
          resetForm()
        },
        onError: (error) => {
          toast.communityCreationFailed(error instanceof Error ? error.message : "An error occurred")
        },
      },
    )
  }

  const resetForm = () => {
    setName("")
    setDescription("")
    setImage("")
  }
>>>>>>> 5672c434978e57a665ac1b270b223a057ef9ff7d

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
<<<<<<< HEAD
        <DialogHeader>
          <DialogTitle>Create New Community</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new community. All members will be
            able to see this information.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
=======
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Community</DialogTitle>
            <DialogDescription>
              Create a new community to connect with people who share your interests.
            </DialogDescription>
          </DialogHeader>

>>>>>>> 5672c434978e57a665ac1b270b223a057ef9ff7d
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Community Name</Label>
              <Input
                id="name"
<<<<<<< HEAD
                name="name"
                placeholder="Enter community name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
=======
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter community name"
                required
              />
            </div>

>>>>>>> 5672c434978e57a665ac1b270b223a057ef9ff7d
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
<<<<<<< HEAD
                name="description"
                placeholder="Describe your community"
                value={form.description}
                onChange={handleChange}
                rows={3}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                name="image"
                placeholder="Enter image URL"
                value={form.image}
                onChange={handleChange}
              />
              <p className="text-xs text-muted-foreground">
                Provide a URL for your community image. Leave blank to use a
                default image.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={form.categoryId}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, categoryId: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
=======
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this community about?"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="image">Image URL (optional)</Label>
              <Input
                id="image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            {createCommunityMutation.error && (
              <div className="text-sm font-medium text-destructive">
                {createCommunityMutation.error instanceof Error
                  ? createCommunityMutation.error.message
                  : "An error occurred"}
              </div>
            )}
          </div>

>>>>>>> 5672c434978e57a665ac1b270b223a057ef9ff7d
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
<<<<<<< HEAD
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Community"}
=======
              disabled={createCommunityMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createCommunityMutation.isPending}>
              {createCommunityMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Community"
              )}
>>>>>>> 5672c434978e57a665ac1b270b223a057ef9ff7d
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
<<<<<<< HEAD
  );
}
=======
  )
}

>>>>>>> 5672c434978e57a665ac1b270b223a057ef9ff7d
