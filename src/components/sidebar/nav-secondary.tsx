import type React from "react"
import { SidebarMenu, SidebarMenuButton } from "@/components/ui/sidebar"

interface NavSecondaryProps extends React.HTMLAttributes<HTMLDivElement> {
  items: {
    title: string
    url: string
    icon: React.ReactNode
  }[]
}

export function NavSecondary({ items, className, ...props }: NavSecondaryProps) {
  return (
    <div className={className} {...props}>
      <SidebarMenu>
        {items.map((item) => (
          <div key={item.title} className="px-1.5">
            <SidebarMenuButton size="sm">
              <div className="flex items-center gap-2">
                {item.icon}
                <span>{item.title}</span>
              </div>
            </SidebarMenuButton>
          </div>
        ))}
      </SidebarMenu>
    </div>
  )
}

