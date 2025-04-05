import { Suspense } from "react"
import CommunitiesList from "@/components/communities/communities-list"
import { CommunitiesHeader } from "@/components/communities/communities-header"
import { LoadingCommunities } from "@/components/communities/loading-communities"

export default function CommunitiesPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <CommunitiesHeader />
      <Suspense fallback={<LoadingCommunities />}>
        <CommunitiesList />
      </Suspense>
    </div>
  )
}

