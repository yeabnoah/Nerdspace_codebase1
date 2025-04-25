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
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { cn } from "@/lib/utils";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationApi, Notification } from "@/api/notification";
import { toast } from "sonner";

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: notificationApi.getNotifications,
    refetchInterval: 60000,
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsReadMutation = useMutation({
    mutationFn: notificationApi.markAsRead,
    onSuccess: () => {
      queryClient.setQueryData<Notification[]>(
        ["notifications"],
        (old) =>
          old?.map((notification) => ({ ...notification, read: true })) || [],
      );
    },
    onError: () => {
      toast.error("Failed to mark notifications as read");
    },
  });

  useEffect(() => {
    if (isOpen && unreadCount > 0) {
      markAsReadMutation.mutate();
    }
  }, [isOpen, unreadCount, markAsReadMutation]);

  const getNotificationLink = (notification: Notification) => {
    switch (notification.type) {
      case "POST_LIKE":
      case "POST_COMMENT":
        return `/post/${notification.post?.id}`;
      case "PROJECT_STAR":
      case "PROJECT_FOLLOW":
      case "PROJECT_UPDATE":
        return `/project/${notification.project?.id}`;
      case "PROJECT_RATING":
      case "PROJECT_REVIEW":
        return `/project/${notification.project?.id}`;
      case "COMMUNITY_POST":
      case "COMMUNITY_INVITE":
        return `/community/${notification.community?.id}`;
      case "FOLLOW":
        return `/user-profile/${notification.actor?.id}`;
      default:
        return "#";
    }
  };

  const getNotificationContent = (notification: Notification) => {
    switch (notification.type) {
      case "POST_LIKE":
        return "liked your post";
      case "POST_COMMENT":
        return "commented on your post";
      case "FOLLOW":
        return "started following you";
      case "PROJECT_STAR":
        return "starred your project";
      case "PROJECT_FOLLOW":
        return "is following your project";
      case "PROJECT_UPDATE":
        return "updated your followed project";
      case "PROJECT_RATING":
        return "rated your project";
      case "PROJECT_REVIEW":
        return "reviewed your project";
      default:
        return notification.message || "";
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
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
          {isLoading ? (
            <div className="flex h-full items-center justify-center p-4">
              <span className="text-sm text-muted-foreground">Loading...</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex h-full items-center justify-center p-4 text-sm text-muted-foreground">
              No notifications yet
            </div>
          ) : (
            notifications.map((notification) => (
              <Link
                href={getNotificationLink(notification)}
                key={notification.id}
              >
                <DropdownMenuItem
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-xl p-3 focus:bg-accent",
                    notification.read && "opacity-60",
                  )}
                >
                  {notification.actor && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={notification.actor.image} />
                      <AvatarFallback>
                        {notification.actor.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm">
                        <span className="font-medium">
                          {notification.actor?.name}
                        </span>{" "}
                        {getNotificationContent(notification)}
                      </span>
                    </div>
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
