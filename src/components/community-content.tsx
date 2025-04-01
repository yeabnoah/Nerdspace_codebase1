"use client"

import { useCommunity } from "@/components/community-provider"
import { CommunityHeader } from "@/components/community-header"
import { CommunityFeed } from "@/components/community-feed"
import { CommunityChat } from "@/components/community-chat"
import { CommunityWelcome } from "@/components/community-welcome"
import type { Community } from "@/lib/types"

interface CommunityContentProps {
  onEditCommunity: (community: Community) => void
}

export function CommunityContent({ onEditCommunity }: CommunityContentProps) {
  const { selectedCommunity, activeTab } = useCommunity()

  if (!selectedCommunity) {
    return <CommunityWelcome />
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <CommunityHeader community={selectedCommunity} onEditCommunity={onEditCommunity} />
      <div className="flex-1 overflow-auto">
        {activeTab === "posts" ? (
          <CommunityFeed community={selectedCommunity} />
        ) : (
          <CommunityChat community={selectedCommunity} />
        )}
      </div>
    </div>
  )
}

