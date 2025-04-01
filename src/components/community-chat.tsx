"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { Send } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useCommunity } from "@/components/community-provider"
import type { Community } from "@/lib/types"

interface CommunityChatProps {
  community: Community
}

export function CommunityChat({ community }: CommunityChatProps) {
  const { currentUser, chatMessages, sendChatMessage } = useCommunity()
  const [message, setMessage] = useState("")
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Check if user is a member
  const isMember = community.members.some((m) => m.userId === currentUser.id)

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [chatMessages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim() && isMember) {
      sendChatMessage(message)
      setMessage("")
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-hidden p-4">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="space-y-3 p-2">
            {chatMessages.length > 0 ? (
              chatMessages.map((msg) => {
                const isCurrentUser = msg.userId === currentUser.id
                const user = community.members.find((m) => m.userId === msg.userId)?.user

                return (
                  <div key={msg.id} className={`flex gap-2 ${isCurrentUser ? "justify-end" : "justify-start"}`}>
                    {!isCurrentUser && (
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={user?.image || undefined} />
                        <AvatarFallback>{user?.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[70%] rounded-lg p-2 ${
                        isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      {!isCurrentUser && <p className="mb-1 text-xs font-medium">{user?.name}</p>}
                      <p className="text-sm">{msg.content}</p>
                      <p className="mt-1 text-right text-xs opacity-70">
                        {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                      </p>
                    </div>
                    {isCurrentUser && (
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={currentUser.image || undefined} />
                        <AvatarFallback>{currentUser.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                )
              })
            ) : (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <h3 className="text-base font-medium">No messages yet</h3>
                  <p className="text-sm text-muted-foreground">
                    {isMember ? "Start the conversation!" : "Join this community to chat."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="border-t p-3">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            placeholder={isMember ? "Type a message..." : "Join community to chat..."}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={!isMember}
            className="flex-1"
          />
          <Button type="submit" size="sm" disabled={!isMember || !message.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  )
}

