"use client"

import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import { CommunityCard } from "./community-card"
import type { CommunityInterface } from "@/interface/auth/community.interface"
import { LoadingSpinner } from "../../src/components/ui/loading-spinner"

export default function CommunitiesList() {
  const [communities, setCommunities] = useState<CommunityInterface[]>([])
  const [cursor, setCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const { ref, inView } = useInView()

  const fetchCommunities = async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)
    try {
      const url = new URL("/api/communities", window.location.origin)
      if (cursor) url.searchParams.append("cursor", cursor)
      url.searchParams.append("limit", "9")

      const response = await fetch(url.toString())
      const data = await response.json()

      if (response.ok) {
        setCommunities((prev) => [...prev, ...data.data])
        setHasMore(data.hasMore)
        if (data.data.length > 0) {
          setCursor(data.data[data.data.length - 1].id)
        }
      }
    } catch (error) {
      console.error("Failed to fetch communities:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCommunities()
  }, [])

  useEffect(() => {
    if (inView) {
      fetchCommunities()
    }
  }, [inView])

  if (communities.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-medium">No communities found</h3>
        <p className="text-muted-foreground mt-2">Be the first to create a community!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {communities.map((community) => (
        <CommunityCard key={community.id} community={community} />
      ))}

      {hasMore && (
        <div ref={ref} className="col-span-full flex justify-center py-8">
          {isLoading && <LoadingSpinner />}
        </div>
      )}
    </div>
  )
}

