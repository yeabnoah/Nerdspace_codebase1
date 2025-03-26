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
    <div className="mx-auto flex max-w-6xl flex-1 flex-row items-start justify-center bg-card">
      <LeftNavbar />
      <div className="my-5 min-h-fit flex-1 md:mx-10">
        <h1 className="mb-8 font-instrument text-3xl tracking-tight">
          Communities
        </h1>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {communities.map((community, index) => (
            <Card
              key={index}
              className="group relative transition-all duration-300 hover:shadow-lg"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <CardHeader className="relative pt-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16 border-2 border-background">
                    <AvatarImage src={community.image} alt={community.name} />
                    <AvatarFallback>
                      {community.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold">{community.name}</h3>
                    <CardDescription className="text-xs text-muted-foreground">
                      {community.description}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="flex flex-col items-center">
                <Button variant="outline" className="mt-4 rounded-full">
                  Join Community
                </Button>
              </CardContent>

              <CardFooter className="border-t px-6 py-4">
                <div className=" flex justify-between w-full gap-2">
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

                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
