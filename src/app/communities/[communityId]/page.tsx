import { notFound } from "next/navigation"
import { CommunityDetail } from "@/components/communities/community-detail"
import { prisma } from "@/lib/prisma"
import getUserSession from "@/functions/get-user"

interface CommunityPageProps {
  params: {
    communityId: string
  }
}

export default async function CommunityPage({ params }: CommunityPageProps) {
  const session = await getUserSession()

  if (!session) {
    // Handle unauthenticated user
    // Could redirect to login or show limited view
  }

  const { communityId } = params

  const community = await prisma.community.findUnique({
    where: { id: communityId },
    include: {
      creator: true,
      members: true,
      posts: {
        include: {
          user: true,
          likes: true,
          comments: true,
        },
      },
      category: true,
    },
  })

  if (!community) {
    notFound()
  }

  const isCreator = session?.user.id === community.creatorId

  const isMember = community.members.some((member) => member.userId === session?.user.id)

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <CommunityDetail
        community={community}
        isCreator={isCreator}
        userId={session?.user.id || ""}
        isMember={isMember}
      />

      {/* Community posts would go here */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Posts</h2>
        {community.posts.length === 0 ? (
          <div className="text-center py-12 bg-muted rounded-lg">
            <h3 className="text-xl font-medium">No posts yet</h3>
            <p className="text-muted-foreground mt-2">Be the first to post in this community!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Post components would go here */}
            <p>Posts would be displayed here</p>
          </div>
        )}
      </div>
    </div>
  )
}

