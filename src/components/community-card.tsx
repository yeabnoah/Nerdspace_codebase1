"use client"

import type React from "react"

import { Users } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useCommunity } from "@/components/community-provider"
import type { Community } from "@/lib/types"

interface CommunityCardProps {
  community: Community
  variant?: "default" | "discover"
  isSelected?: boolean
  onClick?: () => void
}

export function CommunityCard({ community, variant = "default", isSelected, onClick }: CommunityCardProps) {
  const { currentUser, joinCommunity, selectCommunity } = useCommunity()

  // Check if user is a member
  const membership = community.members.find((m) => m.userId === currentUser.id)
  const isMember = !!membership
  const isAdmin = membership?.role === "ADMIN"
  const isModerator = membership?.role === "MODERATOR"

  // Count members
  const memberCount = community.members.length

  const handleJoin = (e: React.MouseEvent) => {
    e.stopPropagation()
    joinCommunity(community.id)
  }

  if (variant === "discover") {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={community.image || undefined} />
              <AvatarFallback>{community.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <h3 className="font-medium">{community.name}</h3>
              <p className="line-clamp-2 text-xs text-muted-foreground">{community.description}</p>

              <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                <Users className="h-3 w-3" />
                <span>{memberCount} members</span>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="border-t p-4 pt-3">
          <Button onClick={() => selectCommunity(community.id)} variant="outline" className="mr-2 flex-1">
            View
          </Button>
          <Button onClick={handleJoin} className="flex-1">
            Join
          </Button>
        </CardFooter>
      </Card>
    )
  }

  return (
    <div
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-accent",
        isSelected && "border-primary/50 bg-accent",
      )}
      onClick={onClick}
    >
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarImage src={community.image || undefined} />
        <AvatarFallback>{community.name.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className="flex-1 overflow-hidden">
        <div className="flex items-center gap-2">
          <h3 className="truncate font-medium">{community.name}</h3>
          {isMember && (
            <Badge variant="outline" className="h-5 px-1.5 text-xs">
              {isAdmin ? "Admin" : isModerator ? "Mod" : "Member"}
            </Badge>
          )}
        </div>

        <p className="line-clamp-2 text-xs text-muted-foreground">{community.description}</p>

        <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
          <Users className="h-3 w-3" />
          <span>{memberCount}</span>
        </div>
      </div>
    </div>
  )
}

