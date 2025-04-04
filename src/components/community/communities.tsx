"use client";

import { useState } from "react";
import { Search, Plus, Filter, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import CreateCommunityDialog from "./create-community-dialog";
import { useCommunitiesQuery } from "@/hooks/use-communities";
import { CommunityInterface } from "@/interface/auth/community.interface";
import {
  CommunityAbout,
  CommunityChat,
  CommunityMembers,
  CommunityPosts,
} from "./community-sections";

export default function CommunitiesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCommunity, setSelectedCommunity] =
    useState<CommunityInterface | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Fetch communities using TanStack Query
  const { data: communities = [], isLoading, error } = useCommunitiesQuery();

  // Set the first community as selected when data loads
  if (communities.length > 0 && !selectedCommunity && !isLoading) {
    setSelectedCommunity(communities[0]);
  }

  const filteredCommunities: CommunityInterface[] = communities.filter(
    (community: CommunityInterface) =>
      community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      community.description.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex items-center justify-between border-b p-4">
        <h1 className="text-2xl font-semibold">Communities</h1>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            New Community
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <Filter className="h-4 w-4" />
                Filter
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>All Communities</DropdownMenuItem>
              <DropdownMenuItem>My Communities</DropdownMenuItem>
              <DropdownMenuItem>Recently Active</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid flex-1 grid-cols-12 gap-0">
        {/* Communities List */}
        <div className="col-span-3 h-full border-r">
          <div className="p-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search communities..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          <ScrollArea className="h-[calc(100vh-12rem)]">
            {isLoading ? (
              <div className="p-4 text-center text-muted-foreground">
                Loading communities...
              </div>
            ) : error ? (
              <div className="p-4 text-center text-destructive">
                {error instanceof Error
                  ? error.message
                  : "Failed to load communities"}
              </div>
            ) : filteredCommunities.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">
                No communities found
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {filteredCommunities.map((community) => (
                  <div
                    key={community.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-md p-2 hover:bg-accent/50 ${
                      selectedCommunity?.id === community.id ? "bg-accent" : ""
                    }`}
                    onClick={() => setSelectedCommunity(community)}
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={community.image || ""}
                        alt={community.name}
                      />
                      <AvatarFallback>
                        {community.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="truncate font-medium">{community.name}</p>
                        <Badge variant="outline" className="text-xs">
                          {community.members?.length || 0}
                        </Badge>
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {community.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>

        {/* Community Details and Content */}
        <div className="col-span-9 flex h-full flex-col">
          {selectedCommunity ? (
            <>
              <CommunityHeader community={selectedCommunity} />
              <Tabs defaultValue="posts" className="flex flex-1 flex-col">
                <TabsList className="mx-4 mt-2">
                  <TabsTrigger value="posts">Posts</TabsTrigger>
                  <TabsTrigger value="chat">Chat</TabsTrigger>
                  <TabsTrigger value="members">Members</TabsTrigger>
                  <TabsTrigger value="about">About</TabsTrigger>
                </TabsList>
                <TabsContent value="posts" className="flex-1 overflow-auto p-4">
                  <CommunityPosts community={selectedCommunity} />
                </TabsContent>
                <TabsContent value="chat" className="flex-1 overflow-auto p-4">
                  <CommunityChat community={selectedCommunity} />
                </TabsContent>
                <TabsContent
                  value="members"
                  className="flex-1 overflow-auto p-4"
                >
                  <CommunityMembers community={selectedCommunity} />
                </TabsContent>
                <TabsContent value="about" className="flex-1 overflow-auto p-4">
                  <CommunityAbout community={selectedCommunity} />
                </TabsContent>
              </Tabs>
            </>
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              {isLoading
                ? "Loading communities..."
                : "Select a community to view details"}
            </div>
          )}
        </div>
      </div>

      <CreateCommunityDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}

function CommunityHeader({ community }: { community: CommunityInterface }) {
  return (
    <div className="border-b p-4">
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={community.image || ""} alt={community.name} />
          <AvatarFallback>
            {community.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold">{community.name}</h2>
          <p className="text-sm text-muted-foreground">
            {community.members?.length || 0} members • Created by{" "}
            {community.creator?.name || "Unknown"}
          </p>
        </div>
        <div className="ml-auto">
          <Button>Join Community</Button>
        </div>
      </div>
    </div>
  );
}
