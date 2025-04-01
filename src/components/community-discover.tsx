"use client"

import type React from "react"

import { useMemo, useState } from "react"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { CommunityCard } from "@/components/community-card"
import { useCommunity } from "@/components/community-provider"

export function CommunityDiscover() {
  const { getDiscoverCommunities, categories } = useCommunity()
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Filter communities based on search query and category
  const filteredCommunities = useMemo(() => {
    let result = getDiscoverCommunities()

    if (searchQuery) {
      result = result.filter(
        (community) =>
          community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          community.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (selectedCategory) {
      result = result.filter((community) => community.categoryId === selectedCategory)
    }

    return result
  }, [getDiscoverCommunities, searchQuery, selectedCategory])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="border-b p-4">
        <h2 className="mb-4 text-xl font-bold">Discover Communities</h2>
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <form onSubmit={handleSearch} className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search communities..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <div className="flex flex-wrap gap-2">
              <button
                className={`rounded-full px-3 py-1 text-xs ${
                  selectedCategory === null ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                }`}
                onClick={() => setSelectedCategory(null)}
              >
                All
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  className={`rounded-full px-3 py-1 text-xs ${
                    selectedCategory === category.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  }`}
                  onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="container max-w-5xl py-6">
          {filteredCommunities.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredCommunities.map((community) => (
                <CommunityCard key={community.id} community={community} variant="discover" />
              ))}
            </div>
          ) : (
            <div className="flex h-40 flex-col items-center justify-center text-center">
              <p className="text-lg font-medium">No communities found</p>
              <p className="text-muted-foreground">Try a different search term or category</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

