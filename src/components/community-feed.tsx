"use client"

import { useCommunity } from "@/components/community-provider"
import { CreatePostForm } from "@/components/create-post-form"
import { PostCard } from "@/components/post-card"
import type { Community } from "@/lib/types"

interface CommunityFeedProps {
  community: Community
}

export function CommunityFeed({ community }: CommunityFeedProps) {
  const { currentUser } = useCommunity()

  // Check if user is a member
  const isMember = community.members.some((m) => m.userId === currentUser.id)

  // Sort posts by date (newest first)
  const sortedPosts = [...community.posts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  return (
    <div className="container max-w-2xl py-4">
      {isMember && <CreatePostForm communityId={community.id} />}

      <div className="mt-4 space-y-4">
        {sortedPosts.length > 0 ? (
          sortedPosts.map((post) => <PostCard key={post.id} post={post} />)
        ) : (
          <div className="rounded-lg border border-dashed p-6 text-center">
            <h3 className="text-base font-medium">No posts yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {isMember ? "Be the first to create a post in this community!" : "Join this community to create posts."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

