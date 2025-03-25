"use client";

import React, { useState } from "react";
import { Users, MessageSquare, Activity, Clock } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import LeftNavbar from "@/components/navbar/left-navbar";

// Sample data
const communities = [
  {
    name: "Tech Enthusiasts",
    description: "A community for tech lovers",
    image: "/hu.webp",
    members: 1023,
    posts: 86,
    activity: 42,
    lastActive: "12.42.21",
  },
  {
    name: "Book Club",
    description: "Discuss and share your favorite books",
    image: "/game.jpg",
    members: 1023,
    posts: 86,
    activity: 42,
    lastActive: "12.42.21",
  },
  {
    name: "Fitness Freaks",
    description: "Stay fit and healthy together",
    image: "/logo.jpg",
    members: 1023,
    posts: 86,
    activity: 42,
    lastActive: "12.42.21",
  },
];

export default function CommunityCards() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="mx-auto flex max-w-6xl flex-1 flex-row items-start justify-center">
      <LeftNavbar />
      <div className="min-h-screen   p-5">
        <h1 className="mb-8 text-3xl font-bold tracking-tight">Communities</h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {communities.map((community, index) => (
            <Card
              key={index}
              className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <div className="absolute left-0 top-0 h-24 w-full bg-gradient-to-br from-primary/20 to-primary/5" />

              <CardHeader className="relative pt-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16 border-4 border-background shadow-md">
                    <AvatarImage src={community.image} alt={community.name} />
                    <AvatarFallback>
                      {community.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold">
                        {community.name}
                      </h3>
                      {/* <Badge variant="secondary" className="text-xs">
                        Community
                      </Badge> */}
                    </div>
                    <CardDescription className="text-xs text-muted-foreground">
                      {community.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex h-24 items-center justify-center">
                  <div
                    className={`transition-all duration-500 ${hoveredIndex === index ? "scale-110" : "scale-100"}`}
                  >
                    <Button variant="outline" className="rounded-full">
                      Join Community
                    </Button>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="border-t bg-muted/30 px-6 py-4">
                <div className="grid w-full grid-cols-4 gap-2">
                  <div className="flex flex-col items-center">
                    <div className="mb-1 flex items-center text-muted-foreground">
                      <Users className="mr-1 h-3 w-3" />
                      <span className="text-xs">Members</span>
                    </div>
                    <span className="text-sm font-medium">
                      {community.members.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="mb-1 flex items-center text-muted-foreground">
                      <MessageSquare className="mr-1 h-3 w-3" />
                      <span className="text-xs">Posts</span>
                    </div>
                    <span className="text-sm font-medium">
                      {community.posts}
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="mb-1 flex items-center text-muted-foreground">
                      <Activity className="mr-1 h-3 w-3" />
                      <span className="text-xs">Activity</span>
                    </div>
                    <span className="text-sm font-medium">
                      {community.activity}
                    </span>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="mb-1 flex items-center text-muted-foreground">
                      <Clock className="mr-1 h-3 w-3" />
                      <span className="text-xs">Last</span>
                    </div>
                    <span className="text-sm font-medium">
                      {community.lastActive}
                    </span>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
