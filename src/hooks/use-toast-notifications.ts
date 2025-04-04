"use client"

import { useToast } from "@/hooks/use-toast"

// Centralized toast notifications for consistent messaging
export function useToastNotifications() {
  const { toast } = useToast()

  return {
    // Community toasts
    communityCreated: () => {
      toast({
        title: "Community created",
        description: "Your new community has been created successfully.",
        variant: "default",
      })
    },
    communityCreationFailed: (error: string) => {
      toast({
        title: "Failed to create community",
        description: error || "There was an error creating your community. Please try again.",
        variant: "destructive",
      })
    },
    communityJoined: (communityName: string) => {
      toast({
        title: "Community joined",
        description: `You have successfully joined ${communityName}.`,
        variant: "default",
      })
    },
    communityJoinFailed: (error: string) => {
      toast({
        title: "Failed to join community",
        description: error || "There was an error joining the community. Please try again.",
        variant: "destructive",
      })
    },

    // Post toasts
    postCreated: () => {
      toast({
        title: "Post created",
        description: "Your post has been published successfully.",
        variant: "default",
      })
    },
    postCreationFailed: (error: string) => {
      toast({
        title: "Failed to create post",
        description: error || "There was an error creating your post. Please try again.",
        variant: "destructive",
      })
    },
    postLiked: () => {
      toast({
        title: "Post liked",
        description: "You liked this post.",
        variant: "default",
      })
    },
    postLikeFailed: (error: string) => {
      toast({
        title: "Failed to like post",
        description: error || "There was an error liking this post. Please try again.",
        variant: "destructive",
      })
    },

    // Comment toasts
    commentAdded: () => {
      toast({
        title: "Comment added",
        description: "Your comment has been added successfully.",
        variant: "default",
      })
    },
    commentFailed: (error: string) => {
      toast({
        title: "Failed to add comment",
        description: error || "There was an error adding your comment. Please try again.",
        variant: "destructive",
      })
    },

    // Generic toasts
    success: (title: string, description?: string) => {
      toast({
        title,
        description,
        variant: "default",
      })
    },
    error: (title: string, description?: string) => {
      toast({
        title,
        description,
        variant: "destructive",
      })
    },
  }
}

