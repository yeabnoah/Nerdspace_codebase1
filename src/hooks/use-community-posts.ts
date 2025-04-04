import { useMutation, useQueryClient } from "@tanstack/react-query"
import api from "@/lib/axios"

// Query keys
export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (communityId: string) => [...postKeys.lists(), communityId] as const,
  details: () => [...postKeys.all, "detail"] as const,
  detail: (id: string) => [...postKeys.details(), id] as const,
}

// Create a new post
export const useCreatePostMutation = (communityId: string) => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (newPost: {
      content: string
      image?: string
    }) => {
      const response = await api.post(`/communities/${communityId}/posts`, newPost)
      return response.data.data
    },
    onSuccess: () => {
      // Invalidate community detail to refresh posts
      queryClient.invalidateQueries({ queryKey: ["communities", "detail", communityId] })
    },
  })
}

// Like a post
export const useLikePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ postId, communityId }: { postId: string; communityId: string }) => {
      const response = await api.post(`/communities/${communityId}/posts/${postId}/like`)
      return response.data.data
    },
    onSuccess: (_, variables) => {
      // Invalidate community detail to refresh posts with updated likes
      queryClient.invalidateQueries({ queryKey: ["communities", "detail", variables.communityId] })
    },
  })
}

// Comment on a post
export const useCreateCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({
      postId,
      communityId,
      content,
    }: {
      postId: string
      communityId: string
      content: string
    }) => {
      const response = await api.post(`/communities/${communityId}/posts/${postId}/comments`, {
        content,
      })
      return response.data.data
    },
    onSuccess: (_, variables) => {
      // Invalidate community detail to refresh posts with updated comments
      queryClient.invalidateQueries({ queryKey: ["communities", "detail", variables.communityId] })
    },
  })
}

