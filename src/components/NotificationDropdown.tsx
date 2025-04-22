import React from "react";
import { Bell } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

type Notification = {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
};

const dummyNotifications: Notification[] = [
  {
    id: "1",
    title: "New Project Share",
    description: "John Doe shared a project with you",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    title: "Comment on Your Project",
    description: "Alice left a comment on your project",
    time: "5 hours ago",
    read: false,
  },
  {
    id: "3",
    title: "System Update",
    description: "NerdSpace has been updated with new features",
    time: "1 day ago",
    read: true,
  },
];

const NotificationDropdown = () => {
  const unreadCount = dummyNotifications.filter((n) => !n.read).length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-80 rounded-2xl border-none bg-white/80 shadow-lg backdrop-blur-sm dark:bg-black/80"
      >
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-lg font-medium">Notifications</p>
            <p className="text-xs text-muted-foreground">
              You have {unreadCount} unread notifications
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {dummyNotifications.map((notification) => (
          <DropdownMenuItem
            key={notification.id}
            className="cursor-pointer rounded-xl p-4 hover:bg-black/10 dark:hover:bg-white/10"
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="font-medium">{notification.title}</span>
                <span className="text-xs text-muted-foreground">
                  {notification.time}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {notification.description}
              </p>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown; 