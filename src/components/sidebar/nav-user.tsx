import { ChevronRight } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface NavUserProps {
  user: {
    name: string
    email: string
    avatar: string
  }
}

export function NavUser({ user }: NavUserProps) {
  return (
    <button className="flex w-full items-center gap-2 rounded-md p-1 hover:bg-zinc-800">
      <Avatar className="h-8 w-8 border border-zinc-700">
        <AvatarImage src={user.avatar} alt={user.name} />
        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex flex-1 flex-col items-start text-sm">
        <span className="font-medium">{user.name}</span>
        <span className="text-xs text-zinc-400">{user.email}</span>
      </div>
      <ChevronRight className="h-4 w-4 text-zinc-400" />
    </button>
  )
}

