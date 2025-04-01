"use client";

import type React from "react";

import { useState } from "react";
import { Search, Plus, User, Bell, LogOut, Compass } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCommunity } from "@/components/community-provider";

interface CommunityNavbarProps {
  onCreateCommunity: () => void;
  activeView: "my-communities" | "discover";
  setActiveView: (view: "my-communities" | "discover") => void;
}

export function CommunityNavbar({
  onCreateCommunity,
  activeView,
  setActiveView,
}: CommunityNavbarProps) {
  const { currentUser, setSearchQuery } = useCommunity();
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchValue);
  };

  return (
    <header className="sticky top-0 z-10 border-b bg-background">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <h1 className="font-instrument text-3xl">Communities</h1>
          <div className="flex items-center gap-2">
            <Button
              variant={activeView === "my-communities" ? "default" : "ghost"}
              size="sm"
              className="h-8 gap-1 rounded-full px-3"
              onClick={() => setActiveView("my-communities")}
            >
              My Communities
            </Button>
            <Button
              variant={activeView === "discover" ? "default" : "ghost"}
              size="sm"
              className="h-8 gap-1 rounded-full px-3"
              onClick={() => setActiveView("discover")}
            >
              <Compass className="mr-1 h-4 w-4" />
              Discover
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* {activeView === "my-communities" && (
            <form
              onSubmit={handleSearch}
              className="relative mr-2 hidden md:block"
            >
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search communities..."
                className="w-[200px] pl-8 md:w-[220px]"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </form>
          )} */}

          <Button
            onClick={onCreateCommunity}
            size="sm"
            className="h-8 gap-1 rounded-full px-3"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden md:inline">New Community</span>
          </Button>
        </div>
      </div>

      {activeView === "my-communities" && (
        <div className="border-b md:hidden">
          <form onSubmit={handleSearch} className="container px-4 py-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search communities..."
                className="w-full pl-8"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          </form>
        </div>
      )}
    </header>
  );
}
