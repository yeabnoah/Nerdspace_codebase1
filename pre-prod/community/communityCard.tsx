"use client";

import type { CommunityInterface } from "@/interface/auth/community.interface";
import { useRouter } from "next/navigation";
import {
  Calendar,
  MessageSquare,
  Users,
  Tag,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const CommunityCard = ({ community }: { community: CommunityInterface }) => {
  const router = useRouter();

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <Card
      className="mb-4 cursor-pointer transition-all duration-300 hover:bg-accent/10 hover:shadow-md"
      onClick={() => router.push(`/community/${community.id}`)}
    >
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 border">
            <AvatarImage
              src={`/placeholder.svg?height=40&width=40&text=${encodeURIComponent(community.name[0])}`}
              alt={community.name}
            />
            <AvatarFallback>{getInitials(community.name)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="line-clamp-1 text-xl font-bold">{community.name}</h2>
            {community.category && (
              <Badge variant="outline" className="mt-1">
                <Tag className="mr-1 h-3 w-3" />
                {community.category.name}
              </Badge>
            )}
          </div>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground" />
      </CardHeader>

      <CardContent className="pb-3">
        <p className="line-clamp-2 text-sm text-muted-foreground">
          {community.description}
        </p>
      </CardContent>

      <CardFooter className="flex flex-wrap gap-x-4 gap-y-2 pt-0 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Users className="h-4 w-4" />
          <span>{community.members.length} members</span>
        </div>

        <div className="flex items-center gap-1">
          <MessageSquare className="h-4 w-4" />
          <span>{community.posts.length} posts</span>
        </div>

        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <span>{new Date(community.createdAt).toLocaleDateString()}</span>
        </div>

        <div className="ml-auto text-xs italic">
          Created by {community.creator.name}
        </div>
      </CardFooter>
    </Card>
  );
};

export default CommunityCard;
