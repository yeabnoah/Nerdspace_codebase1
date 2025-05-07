"use client";

import { Computer, Clock, FolderKanbanIcon, HammerIcon, HomeIcon, Search, Settings, Users } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";

const navItems = [
  { id: "home", icon: HomeIcon, label: "Home", path: "/" },
  { id: "explore", icon: Search, label: "Explore", path: "/explore" },
  { id: "project", icon: FolderKanbanIcon, label: "Project", path: "/project" },
  { id: "community", icon: Users, label: "Community", path: "/community" },
  { id: "events", icon: Clock, label: "Events", path: "/event" },
  { id: "nerd-ai", icon: Computer, label: "Nerd AI", path: "/ai" },
];

const MobileNavBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const getActiveTab = () => {
    const activeItem = navItems.find(
      (item) =>
        pathname === item.path ||
        (item.path !== "/" && pathname.startsWith(item.path))
    );
    return activeItem?.id || "home";
  };
  const activeTab = getActiveTab();

  return (
    <div className="md:hidden bottom-0 left-1/2 z-50 fixed flex justify-between items-center bg-background/90 shadow-2xl backdrop-blur-lg px-2 border border-border rounded-t-3xl w-full max-w-md -translate-x-1/2">
      {navItems.map((item) => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => router.push(item.path)}
            className="group relative flex flex-col flex-1 justify-center items-center py-1"
            style={{ minWidth: 0 }}
            type="button"
          >
            <span
              className={cn(
                "flex items-center my-1 py-1 justify-center w-10 h-10 transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg rounded-full"
                  : "text-muted-foreground"
              )}
            >
              <item.icon size={22} strokeWidth={isActive ? 2.2 : 1.7} />
            </span>
            {/* <span
              className={cn(
                "mt-1 text-xs font-medium transition-colors duration-200",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {item.label}
            </span> */}
            {/* Indicator bar */}
            <span
              className={cn(
                "absolute left-1/2 -translate-x-1/2 bottom-0 h-1 rounded-full transition-all duration-200",
                isActive
                  ? "w-6 bg-primary/80 opacity-80"
                  : "w-0 bg-transparent opacity-0"
              )}
            />
          </button>
        );
      })}
    </div>
  );
};

export default MobileNavBar;
