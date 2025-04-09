"use client";

import React from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  ArrowBigRight,
  LogOut,
  Search,
  Settings,
  UserIcon,
} from "lucide-react";
import { ModeToggle } from "./theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Input } from "./ui/input";
import Link from "next/link";
import useUserStore from "@/store/user.store";
import { Skeleton } from "./ui/skeleton";
import { Command } from "@/components/ui/command";

const Navbar = () => {
  const router = useRouter();
  let loadingToastId: string | undefined;
  const session = authClient.useSession();
  const { user, isloading } = useUserStore();
  const [open, setOpen] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const logout = async () => {
    await authClient.signOut({
      fetchOptions: {
        onRequest: () => {
          loadingToastId = toast.loading("Loading ... logging out");
        },
        onSuccess: () => {
          toast.dismiss(loadingToastId);
          toast.success("you're successfully logged Out");
          router.push("/login");
        },
        onError: () => {
          toast.dismiss(loadingToastId);
          toast.error("error happened while trying to LogOut");
        },
      },
    });
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setOpen(false);
    }
  };

  return (
    <div className="sticky top-0 z-50 mx-auto flex max-w-6xl flex-row items-center justify-between bg-white px-2 py-4 dark:bg-black md:px-6">
      <div
        onClick={() => {
          router.push("/");
        }}
        className="cursor-pointer font-instrument text-3xl text-card-foreground transition-opacity hover:opacity-80 dark:text-white"
      >
        NerdSpace
      </div>

      <div className="flex items-center justify-center gap-5">
        <div className="hidden md:flex">
          <Command className="rounded-lg border shadow-md">
            <form onSubmit={handleSearch} className="flex items-center">
              <Search className="mx-3 h-4 w-4 shrink-0 opacity-50" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="Search anything..."
              />
              <kbd className="pointer-events-none mr-2 inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </form>
          </Command>
        </div>
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="flex items-center justify-center">
                {isloading ? (
                  <Skeleton className="h-8 w-8 rounded-full" />
                ) : (
                  <>
                    <AvatarImage
                      src={user.image || "/user.jpg"}
                      className="size-8 rounded-full"
                      alt="@shadcn"
                    />
                    <AvatarFallback className="">
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </AvatarFallback>
                  </>
                )}
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 dark:bg-textAlternative"
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">
                  {user.name || session.data?.user.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {user.email || session.data?.user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={() => {
                router.push("/profile");
              }}
              className="cursor-pointer"
            >
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                router.push("/settings");
              }}
              className="cursor-pointer"
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default Navbar;
