"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useUserStore from "@/store/user.store";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import {
  Bookmark,
  Dot,
  Grid3X3,
  Hammer,
  Lock,
  SettingsIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import RenderMyPost from "./myposts";
import BookmarksTab from "./tabs/BookmarksTab";
import CollectionsTab from "./tabs/CollectionsTab";
import PrivateTab from "./tabs/PrivateTab";
import ProjectsTab from "./tabs/ProjectsTab";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("posts");
  const { user, isloading, setuser, setIsLoading } = useUserStore();

  console.log(activeTab)

  const { isFetching, isPending } = useQuery({
    queryKey: ["fetch_who_am_i"],
    queryFn: async () => {
      const response = await axios.get("/api/whoami", {
        withCredentials: true,
      });

      setuser(response.data.data);
      setIsLoading(false);
      //console.log(test)
      return response.data;
    },
  });

  if (isloading || isFetching || isPending) {
    return (
      <div className="container relative mx-10 pb-8 font-geist">
        <div className="absolute -right-10 -top-20 h-[300px] w-[300px] -rotate-45 rounded-full bg-gradient-to-br from-amber-300/10 to-transparent blur-[80px] dark:from-orange-300/10"></div>

        <div className="group relative mb-12 h-[400px] w-full overflow-hidden rounded-2xl shadow-lg md:h-[200px]">
          <Skeleton className="h-full w-full" />
        </div>

        <div className="relative z-10 mx-2 my-5 -mt-16 flex flex-col items-start gap-1">
          <div className="relative mx-5 -mt-16 h-28 w-28 overflow-hidden rounded-full ring-2 ring-white/20">
            <Skeleton className="h-full w-full rounded-full" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="space-y-8 lg:col-span-2">
            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-500/5 dark:bg-black">
              <div className="p-8">
                <div className="mb-4">
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="mt-4">
                  <Skeleton className="h-64 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container relative mx-10 pb-8 font-geist">
      <div className="absolute -right-10 -top-20 h-[300px] w-[300px] -rotate-45 rounded-full bg-gradient-to-br from-amber-300/10 to-transparent blur-[80px] dark:from-orange-300/10"></div>

      <div className="group relative mb-12 h-[400px] w-full overflow-hidden rounded-2xl shadow-lg md:h-[200px]">
        <Image
          src={user.coverImage || "/obsession.jpg"}
          alt="Cover Image"
          fill
          quality={100}
          className="object-cover"
          priority={true}
        />
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-zinc-900/90 via-zinc-900/60 to-transparent p-8 dark:from-black/80 dark:via-black/50">
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-900/90 to-transparent dark:from-black"></div>
        </div>

        <Link
          href="/settings"
          className="absolute right-4 top-4 rounded-full bg-black p-2"
        >
          <SettingsIcon className="size-4 cursor-pointer rounded-full text-white" />
        </Link>
      </div>

      <div className="relative z-10 mx-2 my-5 -mt-10 flex flex-col items-start gap-1">
        <div className="relative mx-5 -mt-16 h-28 w-28 overflow-hidden rounded-full ring-2 ring-white/20">
          <Image
            src={user.image || "/user.jpg?height=128&width=128"}
            alt={user.visualName || user.name}
            fill
            className="object-cover"
          />
        </div>
        <h1 className="mt-2 flex flex-row items-center font-geist text-2xl font-medium text-foreground">
          <span className="font-geist text-sm font-medium text-foreground">
            {user.visualName || user.name}
          </span>
          <Dot className="mx-1 h-2 w-2" />
          <span className="font-geist text-sm font-medium text-foreground">
            Nerd@{user.nerdAt}
          </span>
        </h1>

        <h1 className="font-geist text-sm font-normal text-foreground">
          {user.bio || "No bio"}
        </h1>
        <div className="flex gap-4">
          <Link
            href={`/profile/${user.id}/followers`}
            className="font-geist text-sm font-normal text-foreground hover:text-primary"
          >
            {user._count?.following || 0} Followers
          </Link>
          <Link
            href={`/profile/${user.id}/following`}
            className="font-geist text-sm font-normal text-foreground hover:text-primary"
          >
            {user._count?.followers || 0} Following
          </Link>
        </div>
      </div>
      <div className="">
        <div className="space-y-8 lg:col-span-2">
          <Card className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-500/5 dark:bg-black">
            <CardContent className="p-8">
              <Tabs
                defaultValue="posts"
                className="w-full"
                onValueChange={setActiveTab}
              >
                <TabsList className="scrollbar-hide mb-2 flex h-12 justify-start overflow-x-auto bg-transparent">
                  <TabsTrigger
                    value="posts"
                    className="h-10 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Grid3X3 className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Posts</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="projects"
                    className="h-10 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Hammer className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Projects</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="bookmarks"
                    className="h-10 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Bookmark className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Bookmarks</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="private"
                    className="h-10 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Private</span>
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
