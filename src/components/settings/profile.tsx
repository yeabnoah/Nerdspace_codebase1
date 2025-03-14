"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit, Settings, Grid3X3, BookMarked } from "lucide-react";
import useUserStore from "@/store/user.store";
import RenderMyPost from "./myposts";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("posts");
  const { user } = useUserStore();

  return (
    <div className="mx-auto min-h-screen w-[70%] px-4 sm:px-6 lg:px-8">
      <div className="relative h-40 overflow-hidden rounded-xl border bg-transparent">
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
                src={user.image || "/user.jpg?height=128&width=128"}
                alt="Emma Smith"
                width={128}
                height={128}
                className="object-cover"
              />
            </div>
          </div>

          <h1 className="mt-4 text-2xl font-bold">
            {user.visualName || user.name}
          </h1>
          <p className="text-muted-foreground">Nerd@{user.nerdAt}</p>
          <p className="mb-4 text-sm text-muted-foreground">{user.bio}</p>
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
              value="collections"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <BookMarked className="mr-2 h-4 w-4" />
              Collections
            </TabsTrigger>
          </TabsList>

          {/* <hr className=" mb-5" /> */}

          <RenderMyPost />

          <TabsContent value="collections" className="mt-0">
            <div className="flex flex-row">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-md shadow-md">
                  <div className="grid grid-cols-2 gap-0.5">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <div key={j} className="relative aspect-square">
                        <Image
                          src={`/placeholder.svg?height=150&width=150&text=Item+${j + 1}`}
                          alt={`Collection item ${j + 1}`}
                          width={150}
                          height={150}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium">Collection {i + 1}</h3>
                    <p className="text-sm text-muted-foreground">{4} items</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
