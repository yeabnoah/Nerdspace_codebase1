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
import { useRouter } from "next/navigation";
import useUserProfileStore from "@/store/userProfile.store";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("posts");
  const { user, isloading, setuser, setIsLoading } = useUserStore();
  const { userProfile } = useUserProfileStore();
  const router = useRouter();

  const { isFetching, isPending } = useQuery({
    queryKey: ["fetch_who_am_i"],
    queryFn: async () => {
      const response = await axios.get("/api/whoami", {
        withCredentials: true,
      });

      setuser(response.data.data);
      setIsLoading(false);
      return response.data;
    },
  });

  if (isloading || isFetching || isPending) {
    return (
      <div className="mx-auto flex max-w-7xl flex-1 flex-row items-start justify-center">
        {/* <LeftNavbar /> */}
        <div className="mx-auto min-h-screen w-[90%] px-4 sm:px-6 lg:px-8">
          <div className="relative h-40 overflow-hidden rounded-xl border dark:border-gray-500/5">
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
      <div className="relative h-40 overflow-hidden rounded-xl border bg-transparent dark:border-gray-500/5">
        <Image
          src={user.coverImage || "/obsession.jpg"}
          className="w-full bg-cover bg-center"
          height={800}
          width={800}
          alt="test"
        />
        <Button
          onClick={() => {
            router.push("/settings");
          }}
          variant="ghost"
          size="icon"
          className="absolute right-4 top-4 bg-background/20 text-white backdrop-blur-sm hover:bg-background/30"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>

      {/* Profile Info Section */}
      <div className="relative mx-4 pb-6 md:px-6">
        <div className="-mt-12 flex flex-col items-start md:-mt-16">
          <div className="relative">
            <div className="size-20 overflow-hidden rounded-full border md:size-24">
              <Image
                src={user.image || "/user.jpg?height=128&width=128"}
                alt="Emma Smith"
                width={128}
                height={128}
                className="object-cover"
              />
            </div>
          </div>

          <h1 className="mt-2 text-center md:text-left md:text-lg">
            {user.visualName || user.name}
          </h1>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            Nerd@{user.nerdAt}
          </p>
          <p className="mb-2 text-center text-sm text-muted-foreground md:text-left">
            {user.bio}
          </p>
          <div className="mb-4 flex gap-4">
            <Link
              href={`/app/profile/${user.nerdAt}/following`}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              <span className="font-medium text-foreground">
                {user?._count.followers || 0}
              </span>{" "}
              Following
            </Link>
            <Link
              href={`/app/profile/${user.nerdAt}/followers`}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              <span className="font-medium text-foreground">
                {user._count.following || 0}
              </span>{" "}
              Followers
            </Link>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="pb-20 md:px-6">
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
              <span className="hidden sm:inline">Posts</span>
            </TabsTrigger>
            <TabsTrigger
              value="projects"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Hammer className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Projects</span>
            </TabsTrigger>
            <TabsTrigger
              value="collections"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <UsersRound className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Community</span>
            </TabsTrigger>
            <TabsTrigger
              value="bookmarks"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <Bookmark className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Bookmarks</span>
            </TabsTrigger>
            <TabsTrigger
              value="private"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
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
      </div>
    </div>
  );
}
