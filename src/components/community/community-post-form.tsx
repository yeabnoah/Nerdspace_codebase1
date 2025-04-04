"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Image, X, Loader2 } from "lucide-react";
import { useCreatePostMutation } from "@/hooks/use-community-posts";
import { useToastNotifications } from "@/hooks/use-toast-notifications";
import { CommunityInterface } from "@/interface/auth/community.interface";

interface CommunityPostFormProps {
  community: CommunityInterface;
  user: {
    id: string;
    name?: string;
    image?: string;
  };
}

export default function CommunityPostForm({
  community,
  user,
}: CommunityPostFormProps) {
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Use the mutation hook
  const createPostMutation = useCreatePostMutation(community.id);
  const toast = useToastNotifications();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      return;
    }

    createPostMutation.mutate(
      {
        content,
        image: imageUrl || undefined,
      },
      {
        onSuccess: () => {
          toast.postCreated();
          setContent("");
          setImageUrl("");
        },
        onError: (error) => {
          toast.postCreationFailed(
            error instanceof Error ? error.message : "An error occurred",
          );
        },
      },
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // This is a placeholder for actual image upload functionality
    // In a real app, you would upload to a storage service
    setIsUploading(true);

    // Simulate upload delay
    setTimeout(() => {
      setImageUrl(`/placeholder.svg?height=300&width=400&text=${file.name}`);
      setIsUploading(false);
      toast.success(
        "Image uploaded",
        "Your image has been uploaded successfully.",
      );
    }, 1500);
  };

  return (
    <Card className="mb-6">
      <form onSubmit={handleSubmit}>
        <CardContent className="pt-4">
          <div className="flex gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.image || ""} alt={user.name || ""} />
              <AvatarFallback>
                {user.name?.substring(0, 2).toUpperCase() || "UN"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder={`Share something with the ${community.name} community...`}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[100px] resize-none"
              />

              {imageUrl && (
                <div className="relative mt-2 overflow-hidden rounded-md border">
                  <img
                    src={imageUrl || "/placeholder.svg"}
                    alt="Post attachment"
                    className="max-h-60 w-full object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute right-2 top-2 h-8 w-8 rounded-full"
                    onClick={() => setImageUrl("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {createPostMutation.error && (
                <p className="mt-2 text-sm text-destructive">
                  {createPostMutation.error instanceof Error
                    ? createPostMutation.error.message
                    : "An error occurred"}
                </p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="gap-1"
              disabled={isUploading || createPostMutation.isPending}
              onClick={() => document.getElementById("image-upload")?.click()}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Image className="h-4 w-4" />
                  Add Image
                </>
              )}
            </Button>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
              disabled={isUploading || createPostMutation.isPending}
            />
          </div>
          <Button
            type="submit"
            disabled={
              !content.trim() || createPostMutation.isPending || isUploading
            }
          >
            {createPostMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Posting...
              </>
            ) : (
              "Post"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
