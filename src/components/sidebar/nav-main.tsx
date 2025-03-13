import type React from "react"
import { ChevronRight } from "lucide-react"
import { SidebarMenu, SidebarMenuButton } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

interface NavMainProps {
  items: {
    title: string
    url: string
    icon: React.ReactNode
    isActive?: boolean
    items?: {
      title: string
      url: string
    }[]
  }[]
}

export function NavMain({ items }: NavMainProps) {
  return (
    <div className="py-2">
      <div className="px-3 pb-1">
        <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">Settings</h2>
      </div>
      <SidebarMenu>
        {items.map((item) => (
          <div key={item.title} className="px-1.5">
            <SidebarMenuButton className={cn("justify-between", item.isActive && "bg-zinc-800 text-white")}>
              <div className="flex items-center gap-2">
                {item.icon}
                <span>{item.title}</span>
              </div>
              {item.items && item.items.length > 0 && <ChevronRight className="h-4 w-4 text-zinc-400" />}
            </SidebarMenuButton>
          </div>
        ))}
      </SidebarMenu>
    </div>
  )
}

