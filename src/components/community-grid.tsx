"use client";

import { useMemo } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CommunityCard } from "@/components/community-card";
import { useCommunity } from "@/components/community-provider";

export function CommunityGrid() {
  const {
    communities,
    currentUser,
    selectedCommunity,
    selectCommunity,
    filter,
    setFilter,
    searchQuery,
  } = useCommunity();

  // Filter communities based on the selected filter and search query
  const filteredCommunities = useMemo(() => {
    let result = communities;

    // Apply search filter
    if (searchQuery) {
      result = result.filter(
        (community) =>
          community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          community.description
            .toLowerCase()
            .includes(searchQuery.toLowerCase()),
      );
    }

    // Apply tab filter
    if (filter === "joined") {
      result = result.filter((community) =>
        community.members.some((member) => member.userId === currentUser.id),
      );
    } else if (filter === "discover") {
      result = result.filter(
        (community) =>
          !community.members.some((member) => member.userId === currentUser.id),
      );
    }

    return result;
  }, [communities, currentUser.id, filter, searchQuery]);

  return (
    <div className="flex h-full w-full flex-col border-r md:w-80 lg:w-96">
      <div className="border-b p-4">
        <Tabs
          value={filter}
          onValueChange={(value) =>
            setFilter(value as "all" | "joined" | "discover")
          }
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="joined">Joined</TabsTrigger>
            <TabsTrigger value="discover">Discover</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-3">
          {filteredCommunities.length > 0 ? (
            <div className="grid gap-2">
              {filteredCommunities.map((community) => (
                <CommunityCard
                  key={community.id}
                  community={community}
                  isSelected={selectedCommunity?.id === community.id}
                  onClick={() => selectCommunity(community.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex h-40 flex-col items-center justify-center text-center">
              <p className="text-sm font-medium">No communities found</p>
              <p className="text-xs text-muted-foreground">
                {filter === "joined"
                  ? "You haven't joined any communities yet."
                  : "Try a different search term."}
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
