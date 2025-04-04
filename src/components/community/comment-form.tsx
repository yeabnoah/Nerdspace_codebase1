"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Send } from "lucide-react"
import { useCreateCommentMutation } from "@/hooks/use-community-posts"
import { useToastNotifications } from "@/hooks/use-toast-notifications"

interface CommentFormProps {
  postId: string
  communityId: string
  user: {
    id: string
    name?: string
    image?: string
  }
  onCommentAdded?: () => void
}

export default function CommentForm({ postId, communityId, user, onCommentAdded }: CommentFormProps) {
  const [content, setContent] = useState("")
  const createCommentMutation = useCreateCommentMutation()
  const toast = useToastNotifications()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!content.trim()) return

    createCommentMutation.mutate(
      {
        postId,
        communityId,
        content,
      },
      {
        onSuccess: () => {
          toast.commentAdded()
          setContent("")
          if (onCommentAdded) onCommentAdded()
        },
        onError: (error) => {
          toast.commentFailed(error instanceof Error ? error.message : "An error occurred")
        },
      },
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-start gap-2 mt-4">
      <Avatar className="h-8 w-8">
        <AvatarImage src={user.image || ""} alt={user.name || ""} />
        <AvatarFallback>{user.name?.substring(0, 2).toUpperCase() || "UN"}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <Textarea
          placeholder="Write a comment..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-[80px] resize-none"
        />
        <div className="flex justify-end mt-2">
          <Button type="submit" size="sm" disabled={!content.trim() || createCommentMutation.isPending}>
            {createCommentMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
                Posting...
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-1" />
                Comment
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}

