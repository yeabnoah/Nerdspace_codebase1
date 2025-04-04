"use client"

import { useState } from "react"
import { MessageSquare, ThumbsUp, Loader2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useLikePostMutation } from "@/hooks/use-community-posts"
import { useToastNotifications } from "@/hooks/use-toast-notifications"
import { CommunityInterface } from "@/interface/auth/community.interface"
import PostComments from "./post-comments"

export function CommunityPosts({ community }: { community: CommunityInterface }) {
  const likePostMutation = useLikePostMutation()
  const toast = useToastNotifications()

  // Mock user - in a real app, this would come from authentication
  const currentUser = {
    id: "user-1",
    name: "Current User",
    image: "/placeholder.svg?height=40&width=40",
  }

  const handleLikePost = (postId: string) => {
    likePostMutation.mutate(
      { postId, communityId: community.id },
      {
        onSuccess: () => {
          toast.postLiked()
        },
        onError: (error) => {
          toast.postLikeFailed(error instanceof Error ? error.message : "An error occurred")
        },
      },
    )
  }

  return (
    <div className="space-y-4">
      {community.posts && community.posts.length > 0 ? (
        <div className="space-y-4">
          {community.posts.map((post) => (
            <Card key={post.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={post.user?.image || ""} alt={post.user?.name || ""} />
                    <AvatarFallback>{post.user?.name?.substring(0, 2).toUpperCase() || "UN"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{post.user?.name || "Unknown User"}</p>
                    <p className="text-xs text-muted-foreground">{new Date(post.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p>{post.content}</p>
                {post.image && (
                  <div className="mt-3">
                    <img
                      src={post.image || "/placeholder.svg"}
                      alt="Post attachment"
                      className="rounded-md max-h-80 object-cover"
                    />
                  </div>
                )}

                <PostComments post={post} communityId={community.id} user={currentUser} />
              </CardContent>
              <CardFooter className="pt-2 flex justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" className="gap-1 h-8">
                    <MessageSquare className="h-4 w-4" />
                    {post.comments?.length || 0} Comments
                  </Button>
                </div>
                <div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-1 h-8"
                    onClick={() => handleLikePost(post.id)}
                    disabled={likePostMutation.isPending}
                  >
                    {likePostMutation.isPending && likePostMutation.variables?.postId === post.id ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-1" />
                    ) : (
                      <ThumbsUp className="h-4 w-4 mr-1" />
                    )}
                    {post.likes?.length || 0} Likes
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center p-8 border rounded-md bg-accent/10">
          <p className="text-muted-foreground">No posts yet in this community</p>
          <Button className="mt-4">Create the first post</Button>
        </div>
      )}
    </div>
  )
}

export function CommunityChat({ community }: { community: CommunityInterface }) {
  const [message, setMessage] = useState("")
  const toast = useToastNotifications()

  // This would be replaced with actual chat messages from an API
  const dummyMessages = [
    { id: 1, user: community.creator, content: "Welcome to the community chat!", timestamp: new Date() },
    { id: 2, user: { id: "2", name: "Jane Doe" }, content: "Thanks for having me!", timestamp: new Date() },
    {
      id: 3,
      user: { id: "3", name: "John Smith" },
      content: "What's everyone working on today?",
      timestamp: new Date(),
    },
  ]

  const handleSendMessage = () => {
    if (!message.trim()) return

    // This would be replaced with an actual API call
    toast.success("Message sent", "Your message has been sent successfully.")
    setMessage("")
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 space-y-4 mb-4">
        {dummyMessages.map((msg) => (
          <div key={msg.id} className="flex items-start gap-2">
            <Avatar className="h-8 w-8 mt-0.5">
              <AvatarFallback>{msg.user?.name?.substring(0, 2).toUpperCase() || "UN"}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium">{msg.user?.name}</span>
                <span className="text-xs text-muted-foreground">
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
              <p className="text-sm">{msg.content}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4">
        <div className="flex gap-2">
          <Input
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
          />
          <Button onClick={handleSendMessage} disabled={!message.trim()}>
            <Send className="h-4 w-4 mr-2" />
            Send
          </Button>
        </div>
      </div>
    </div>
  )
}

export function CommunityMembers({ community }: { community: CommunityInterface }) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Members ({community.members?.length || 0})</h3>

      <div className="space-y-2">
        {community.members && community.members.length > 0 ? (
          community.members.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-2 rounded-md hover:bg-accent/50">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={member.user?.image || ""} alt={member.user?.name || ""} />
                  <AvatarFallback>{member.user?.name?.substring(0, 2).toUpperCase() || "UN"}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{member.user?.name || "Unknown User"}</p>
                  <p className="text-xs text-muted-foreground">
                    Joined {new Date(member.joinedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Badge variant={member.role === "ADMIN" ? "default" : "outline"}>{member.role}</Badge>
            </div>
          ))
        ) : (
          <p className="text-center text-muted-foreground">No members found</p>
        )}
      </div>
    </div>
  )
}

export function CommunityAbout({ community }: { community: CommunityInterface }) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>About {community.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-1">Description</h4>
            <p className="text-sm text-muted-foreground">{community.description}</p>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-1">Created</h4>
            <p className="text-sm text-muted-foreground">{new Date(community.createdAt).toLocaleDateString()}</p>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-1">Category</h4>
            <p className="text-sm text-muted-foreground">{community.category?.name || "Uncategorized"}</p>
          </div>

          <Separator />

          <div>
            <h4 className="text-sm font-medium mb-1">Creator</h4>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={community.creator?.image || ""} alt={community.creator?.name || ""} />
                <AvatarFallback>{community.creator?.name?.substring(0, 2).toUpperCase() || "UN"}</AvatarFallback>
              </Avatar>
              <p className="text-sm">{community.creator?.name || "Unknown"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Community Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="font-medium">1.</span>
              <span>Be respectful to other members</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-medium">2.</span>
              <span>No spam or self-promotion</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-medium">3.</span>
              <span>Stay on topic with community discussions</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

