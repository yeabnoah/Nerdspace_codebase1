"use client";

import React, { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Bell } from "lucide-react";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface Notification {
  id: string;
  type: string;
  message: string;
  createdAt: string;
  read: boolean;
  actor: {
    name: string;
    image: string;
  } | null;
  post: {
    id: string;
  } | null;
  project: {
    id: string;
  } | null;
  community: {
    id: string;
  } | null;
}

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const response = await fetch("/api/notification");
      if (!response.ok) throw new Error("Failed to fetch notifications");
      const data = await response.json();
      setNotifications(data);
      setUnreadCount(data.filter((n: Notification) => !n.read).length);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Fetch notifications every minute
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const getNotificationLink = (notification: Notification) => {
    switch (notification.type) {
      case "POST_LIKE":
      case "POST_COMMENT":
        return `/post/${notification.post?.id}`;
      case "PROJECT_STAR":
      case "PROJECT_FOLLOW":
      case "PROJECT_UPDATE":
        return `/project/${notification.project?.id}`;
      case "COMMUNITY_POST":
      case "COMMUNITY_INVITE":
        return `/community/${notification.community?.id}`;
      case "FOLLOW":
        return `/profile/${notification.actor?.name}`;
      default:
        return "#";
    }
  };

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
        className="w-80 rounded-2xl border-none bg-white/80 p-2 shadow-lg backdrop-blur-sm dark:bg-black/80"
      >
        <ScrollArea className="h-[300px]">
          {notifications.length === 0 ? (
            <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            notifications.map((notification) => (
              <Link
                href={getNotificationLink(notification)}
                key={notification.id}
              >
                <DropdownMenuItem className="flex cursor-pointer flex-col gap-1 rounded-xl p-3 focus:bg-accent">
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-sm">{notification.message}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </DropdownMenuItem>
              </Link>
            ))
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
