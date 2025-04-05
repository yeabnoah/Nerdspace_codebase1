import Link from "next/link"
import Image from "next/image"
import type { CommunityInterface } from "@/interface/auth/community.interface"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Users, MessageSquare } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface CommunityCardProps {
  community: CommunityInterface
}

export function CommunityCard({ community }: CommunityCardProps) {
  const memberCount = community.members.length
  const postCount = community.posts.length
  const createdAt = new Date(community.createdAt)

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="p-0">
        <div className="relative h-40 w-full">
          {community.image ? (
            <Image src={community.image || "/placeholder.svg"} alt={community.name} fill className="object-cover" />
          ) : (
            <div className="h-full w-full bg-gradient-to-r from-gray-200 to-gray-300 flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-500">{community.name.charAt(0).toUpperCase()}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-lg line-clamp-1">{community.name}</h3>
            <p className="text-muted-foreground text-sm mt-1 line-clamp-2">{community.description}</p>
          </div>
        </div>

        <div className="flex items-center mt-4 text-sm text-muted-foreground">
          <div className="flex items-center mr-4">
            <Users className="h-4 w-4 mr-1" />
            <span>
              {memberCount} {memberCount === 1 ? "member" : "members"}
            </span>
          </div>
          <div className="flex items-center">
            <MessageSquare className="h-4 w-4 mr-1" />
            <span>
              {postCount} {postCount === 1 ? "post" : "posts"}
            </span>
          </div>
        </div>

        <div className="flex items-center mt-4">
          <Avatar className="h-6 w-6 mr-2">
            <AvatarImage src={community.creator.image || ""} />
            <AvatarFallback>{community.creator.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <span className="text-xs">
            Created by <span className="font-medium">{community.creator.name}</span>
            {" · "}
            {formatDistanceToNow(createdAt, { addSuffix: true })}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/communities/${community.id}`}>View Community</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

