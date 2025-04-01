"use client"

import { Users } from "lucide-react"

export function CommunityWelcome() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-6">
      <div className="mx-auto max-w-md text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Users className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Select a Community</h1>
        <p className="mt-2 text-muted-foreground">
          Choose a community from the sidebar to view posts and join conversations.
        </p>
      </div>
    </div>
  )
}

