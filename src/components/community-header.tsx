"use client"

import { Edit, MessageSquare, Users, FileText, MoreHorizontal, LogOut, UserPlus, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useCommunity } from "@/components/community-provider"
import type { Community } from "@/lib/types"

interface CommunityHeaderProps {
  community: Community
  onEditCommunity: (community: Community) => void
}

export function CommunityHeader({ community, onEditCommunity }: CommunityHeaderProps) {
  const { currentUser, activeTab, setActiveTab, joinCommunity, leaveCommunity } = useCommunity()

  // Check if user is a member
  const membership = community.members.find((m) => m.userId === currentUser.id)
  const isMember = !!membership
  const isAdmin = membership?.role === "ADMIN"
  const isModerator = membership?.role === "MODERATOR"

  // Count members
  const memberCount = community.members.length

  return (
    <div className="border-b bg-background">
      <div className="flex flex-col p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={community.image || undefined} />
              <AvatarFallback className="text-base">{community.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">{community.name}</h1>
                {(isAdmin || isModerator) && (
                  <Badge variant="outline" className="h-5 px-1.5 text-xs">
                    {isAdmin ? "Admin" : "Moderator"}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{community.description}</p>
              <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  <span>
                    {memberCount} {memberCount === 1 ? "member" : "members"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isMember ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {(isAdmin || isModerator) && (
                    <DropdownMenuItem onClick={() => onEditCommunity(community)}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Edit Community</span>
                    </DropdownMenuItem>
                  )}
                  {(isAdmin || isModerator) && (
                    <DropdownMenuItem>
                      <Shield className="mr-2 h-4 w-4" />
                      <span>Manage Members</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => leaveCommunity(community.id)}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Leave Community</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => joinCommunity(community.id)} size="sm" className="h-8 rounded-full">
                <UserPlus className="mr-1.5 h-3.5 w-3.5" />
                Join
              </Button>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "posts" | "chat")} className="mt-3">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="posts">
              <FileText className="mr-1.5 h-3.5 w-3.5" />
              Posts
            </TabsTrigger>
            <TabsTrigger value="chat">
              <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
              Chat
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  )
}

