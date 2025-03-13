import type React from "react"
import { Plus } from "lucide-react"
import { SidebarMenu, SidebarMenuButton } from "@/components/ui/sidebar"

interface NavProjectsProps {
  projects: {
    name: string
    url: string
    icon: React.ReactNode
  }[]
}

export function NavProjects({ projects }: NavProjectsProps) {
  return (
    <div className="py-2">
      <div className="flex items-center justify-between px-3 pb-1">
        <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Communities</h2>
        <button className="rounded-full p-0.5 hover:bg-zinc-800">
          <Plus className="h-4 w-4 text-zinc-400" />
        </button>
      </div>
      <SidebarMenu>
        {projects.map((project) => (
          <div key={project.name} className="px-1.5">
            <SidebarMenuButton size="sm">
              <div className="flex items-center gap-2">
                {project.icon}
                <span>{project.name}</span>
              </div>
            </SidebarMenuButton>
          </div>
        ))}
      </SidebarMenu>
    </div>
  )
}

