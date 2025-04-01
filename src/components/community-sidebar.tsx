"use client"

import { useMemo } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { useCommunity } from "@/components/community-provider"

export function CommunitySidebar() {
  const { getUserCommunities, selectedCommunity, selectCommunity, searchQuery } = useCommunity()

  // Filter communities based on search query
  const filteredCommunities = useMemo(() => {
    const userCommunities = getUserCommunities()

    if (!searchQuery) return userCommunities

    return userCommunities.filter(
      (community) =>
        community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        community.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )
  }, [getUserCommunities, searchQuery])

  return (
    <div className="flex h-full w-32 flex-col border-r">
      <ScrollArea className="flex-1">
        <div className="flex flex-col items-center gap-4 p-3">
          {filteredCommunities.length > 0 ? (
            filteredCommunities.map((community) => (
              <button
                key={community.id}
                className={cn(
                  "group relative flex flex-col items-center",
                  selectedCommunity?.id === community.id &&
                    "after:absolute after:-right-3 after:h-10 after:w-1 after:rounded-l-full after:bg-primary",
                )}
                onClick={() => selectCommunity(community.id)}
              >
                <Avatar
                  className={cn(
                    "h-12 w-12 transition-all group-hover:ring-2 group-hover:ring-primary/20",
                    selectedCommunity?.id === community.id && "ring-2 ring-primary",
                  )}
                >
                  <AvatarImage src={community.image || undefined} />
                  <AvatarFallback>{community.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="mt-1 w-full truncate text-center text-xs">{community.name}</span>
              </button>
            ))
          ) : (
            <div className="flex h-40 flex-col items-center justify-center text-center">
              <p className="text-xs text-muted-foreground">No communities found</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

