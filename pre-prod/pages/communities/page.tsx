import { Suspense } from "react"
import CommunitiesList from "../../communities/communities-list"
import { CommunitiesHeader } from "../../communities/communities-header"
import { LoadingCommunities } from "../../communities/loading-communities"

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

