"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings,
  Grid3X3,
  Bookmark,
  Lock,
  UsersRound,
  Hammer,
} from "lucide-react";
import useUserStore from "@/store/user.store";
import RenderMyPost from "./myposts";
import ProjectsTab from "./tabs/ProjectsTab";
import CollectionsTab from "./tabs/CollectionsTab";
import BookmarksTab from "./tabs/BookmarksTab";
import PrivateTab from "./tabs/PrivateTab";
import { Skeleton } from "../ui/skeleton";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("posts");
  const { user, isloading } = useUserStore();

  if (isloading) {
    return (
      <div className="mx-auto flex max-w-7xl flex-1 flex-row items-start justify-center">
        {/* <LeftNavbar /> */}
        <div className="mx-auto min-h-screen w-[90%] px-4 sm:px-6 lg:px-8">
          <div className="relative h-40 overflow-hidden rounded-xl border">
            <Skeleton className="h-full w-full" />
          </div>
          <div className="relative px-6 pb-6">
            <div className="-mt-16 flex flex-col">
              <div className="relative">
                <Skeleton className="size-24 rounded-full" />
              </div>
              <Skeleton className="mb-2 mt-2 h-10 w-1/2" />
              {/* <Skeleton className="h-4 w-1/3" /> */}
              <Skeleton className="mb-4 h-4 w-3/4" />
            </div>
          </div>
          <div className="px-6 pb-20">
            <Skeleton className="h-10 w-full" />
            <div className="mt-4">
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
        {/* <MobileNavBar /> */}
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen w-full px-4 md:w-[70%] md:px-8">
      <div className="relative h-40 overflow-hidden rounded-xl border bg-transparent">
        <Image
          src={user.coverImage || "/obsession.jpg"}
          className="w-full bg-cover bg-center"
          height={800}
          width={800}
          alt="test"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 bg-background/20 text-white backdrop-blur-sm hover:bg-background/30"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {/* Profile Info Section */}
      <div className="relative px-6 pb-6">
        <div className="-mt-16 flex flex-col items-start">
          <div className="relative">
            <div className="size-24 overflow-hidden rounded-full border">
              <Image
                src={user.image || "/user.jpg?height=128&width=128"}
                alt="Emma Smith"
                width={128}
                height={128}
                className="object-cover"
              />
            </div>
          </div>

          <h1 className="mt-2 text-center text-lg md:text-left">
            {user.visualName || user.name}
          </h1>
          <p className="text-center text-muted-foreground md:text-left">
            Nerd@{user.nerdAt}
          </p>
          <p className="mb-4 text-center text-sm text-muted-foreground md:text-left">
            {user.bio}
          </p>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="px-4 pb-20 md:px-6">
        <Tabs
          defaultValue="posts"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="scrollbar-hide mb-2 flex justify-start overflow-x-auto bg-transparent">
            <TabsTrigger
              value="posts"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Grid3X3 className="mr-2 h-4 w-4" />
              Posts
            </TabsTrigger>
            <TabsTrigger
              value="projects"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Hammer className="mr-2 h-4 w-4" />
              Projects
            </TabsTrigger>
            <TabsTrigger
              value="collections"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <UsersRound className="mr-2 h-4 w-4" />
              Community
            </TabsTrigger>
            <TabsTrigger
              value="bookmarks"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Bookmark className="mr-2 h-4 w-4" />
              Bookmarks
            </TabsTrigger>
            <TabsTrigger
              value="private"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Lock className="mr-2 h-4 w-4" />
              Private
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-0">
            <RenderMyPost />
          </TabsContent>
          <TabsContent value="projects" className="mt-0">
            <ProjectsTab />
          </TabsContent>
          <TabsContent value="collections" className="mt-0">
            <CollectionsTab />
          </TabsContent>
          <TabsContent value="bookmarks" className="mt-0">
            <BookmarksTab />
          </TabsContent>
          <TabsContent value="private" className="mt-0">
            <PrivateTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
