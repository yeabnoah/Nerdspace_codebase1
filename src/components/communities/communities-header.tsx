"use client"

import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { useState } from "react"
import { CreateCommunityDialog } from "./create-community-dialog"

export function CommunitiesHeader() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Communities</h1>
        <p className="text-muted-foreground mt-1">Discover and join communities or create your own</p>
      </div>
      <Button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center gap-2">
        <PlusCircle className="h-4 w-4" />
        Create Community
      </Button>

      <CreateCommunityDialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen} />
    </div>
  )
}

