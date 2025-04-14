"use client";

import type React from "react";

// import { useCommunity } from "@/components/community-provider"
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { ImagePlus, Send } from "lucide-react";
import { useState } from "react";

interface CreatePostFormProps {
  communityId: string;
}

export function CreatePostForm({ communityId }: CreatePostFormProps) {
  // const { currentUser, createPost } = useCommunity()
  const [content, setContent] = useState("");
  const [image, setImage] = useState<string | undefined>();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      // createPost(communityId, content, image)
      setContent("");
      setImage(undefined);
      setIsExpanded(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // In a real app, you would upload the image to a server
    // For this demo, we'll just use a placeholder
    setImage("/placeholder.svg?height=300&width=600");
  };

  return (
    <Card className="overflow-hidden">
      <form onSubmit={handleSubmit}>
        <CardContent className="p-3">
          <div className="flex gap-2">
            <Avatar className="h-8 w-8">
              {/* <AvatarImage src={currentUser.image || undefined} /> */}
              <AvatarFallback>
                {/* {currentUser.name.substring(0, 2).toUpperCase()} */}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <Textarea
                placeholder="Share something with the community..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onFocus={() => setIsExpanded(true)}
                className="min-h-[40px] resize-none border-0 p-0 text-sm focus-visible:ring-0"
              />
              {image && isExpanded && (
                <div className="mt-2 overflow-hidden rounded-md border">
                  <img
                    src={image || "/placeholder.svg"}
                    alt="Post attachment"
                    className="h-auto max-h-[200px] w-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        </CardContent>

        {isExpanded && (
          <CardFooter className="flex justify-between border-t px-3 py-2">
            <div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 text-xs text-muted-foreground"
                onClick={() => document.getElementById("image-upload")?.click()}
              >
                <ImagePlus className="mr-1.5 h-3.5 w-3.5" />
                Image
              </Button>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
            <Button
              type="submit"
              size="sm"
              className="h-7"
              disabled={!content.trim()}
            >
              <Send className="mr-1.5 h-3.5 w-3.5" />
              Post
            </Button>
          </CardFooter>
        )}
      </form>
    </Card>
  );
}
