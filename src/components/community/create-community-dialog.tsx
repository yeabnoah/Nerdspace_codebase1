"use client";

import type React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCommunityMutation } from "@/hooks/use-communities";
import { useToastNotifications } from "@/hooks/use-toast-notifications";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface CreateCommunityDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateCommunityDialog({
  open,
  onOpenChange,
}: CreateCommunityDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  // Use the mutation hook
  const createCommunityMutation = useCreateCommunityMutation();
  const toast = useToastNotifications();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    createCommunityMutation.mutate(
      {
        name,
        description,
        image: image || undefined,
      },
      {
        onSuccess: () => {
          toast.communityCreated();
          onOpenChange(false);
          resetForm();
        },
        onError: (error) => {
          toast.communityCreationFailed(
            error instanceof Error ? error.message : "An error occurred",
          );
        },
      },
    );
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setImage("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <div className="absolute right-4 top-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Community</DialogTitle>
            <DialogDescription>
              Create a new community to connect with people who share your
              interests.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Community Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter community name"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
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

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
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
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
