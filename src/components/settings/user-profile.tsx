"use client";

import { useState, useEffect } from "react";
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
import useUserProfileStore from "@/store/userProfile.store";
import RenderUserPosts from "./user-posts";
import ProjectsTab from "./tabs/ProjectsTab";
import CollectionsTab from "./tabs/CollectionsTab";
import BookmarksTab from "./tabs/BookmarksTab";
import PrivateTab from "./tabs/PrivateTab";
import Link from "next/link";
// import UserProfileStats from "./user-profile-stats";

interface FollowCounts {
  followers: number;
  following: number;
}

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("posts");
  const { userProfile } = useUserProfileStore();
  const [followCounts, setFollowCounts] = useState<FollowCounts>({
    followers: 0,
    following: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFollowCounts = async () => {
      if (!userProfile?.id) return;
      
      try {
        const [followersRes, followingRes] = await Promise.all([
          fetch(`/api/users/${userProfile.id}/followers?limit=1`),
          fetch(`/api/users/${userProfile.id}/following?limit=1`),
        ]);

        const [followersData, followingData] = await Promise.all([
          followersRes.json(),
          followingRes.json(),
        ]);

        setFollowCounts({
          followers: followersData.pagination.total,
          following: followingData.pagination.total,
        });
      } catch (error) {
        console.error("Error fetching follow counts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowCounts();
  }, [userProfile?.id]);

  return (
    <div className="mx-auto min-h-screen sm:px-6 md:w-[70%] md:px-4 lg:px-8">
      <div className="relative h-40 overflow-hidden rounded-xl border bg-transparent">
        <Image
          src={userProfile?.coverImage || "/obsession.jpg"}
          className="h-full w-full object-cover md:max-h-max md:w-full"
          height={1000}
          width={1000}
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
        <div className="-mt-16 flex flex-col">
          <div className="relative">
            <div className="size-24 overflow-hidden rounded-full border">
              <Image
                src={userProfile?.image || "/user.jpg?height=128&width=128"}
                alt={userProfile?.name || "User"}
                width={128}
                height={128}
                className="object-cover"
              />
            </div>
          </div>

          <h1 className="mt-2 text-lg">
            {userProfile?.visualName || userProfile?.name}
          </h1>
          <p className="text-muted-foreground">Nerd@{userProfile?.nerdAt}</p>
          <p className="mb-4 text-sm text-muted-foreground">
            {userProfile?.bio}
          </p>
          <div className="mb-4 flex gap-4">
            <Link
              href={`/profile/user/${userProfile?.id}/following`}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              <span className="font-medium text-foreground">
                {loading ? "..." : followCounts.following}
              </span>{" "}
              Following
            </Link>
            <Link
              href={`/profile/user/${userProfile?.id}/followers`}
              className="text-sm text-muted-foreground hover:text-primary"
            >
              <span className="font-medium text-foreground">
                {loading ? "..." : followCounts.followers}
              </span>{" "}
              Followers
            </Link>
          </div>
        </div>
      </div>

      {/* Content Tabs */}
      <div className="px-6 pb-20">
        <Tabs
          defaultValue="posts"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="mb-2 flex justify-start bg-transparent">
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
          </TabsList>

          <TabsContent value="posts" className="mt-0">
            <RenderUserPosts />
          </TabsContent>
          <TabsContent value="projects" className="mt-0">
            <ProjectsTab />
          </TabsContent>
          {/* <TabsContent value="collections" className="mt-0">
            <CollectionsTab />
          </TabsContent> */}
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
