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
import {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { DialogTitle } from "@/components/ui/dialog";
import useSearchStore from "@/store/search.store";

const Navbar = () => {
  const router = useRouter();
  let loadingToastId: string | undefined;
  const session = authClient.useSession();
  const { user, isloading } = useUserStore();
  const { query, setQuery, isSearchOpen, setIsSearchOpen } = useSearchStore();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [setIsSearchOpen]);

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
          <CommandDialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <DialogTitle className="sr-only">Search</DialogTitle>
            <CommandInput
              value={query}
              onValueChange={setQuery}
              placeholder="Search anything..."
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
            <CommandList>
              {query.trim() && (
                <CommandGroup>
                  <CommandItem
                    onSelect={() => {
                      if (query.trim()) {
                        router.push(`/explore?q=${encodeURIComponent(query)}`);
                        setIsSearchOpen(false);
                        setQuery("");
                      }
                    }}
                  >
                    <span>Search "{query}"</span>
                  </CommandItem>
                </CommandGroup>
              )}
            </CommandList>
          </CommandDialog>
          <Button
            variant="outline"
            className="relative h-11 w-64 justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
            onClick={() => setIsSearchOpen(true)}
          >
            <span className="inline-flex">Search...</span>
            <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
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
            className="w-48 rounded-2xl border-none bg-white/80 shadow-lg backdrop-blur-sm dark:bg-black/80"
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
              className="cursor-pointer h-10 rounded-xl hover:bg-primary/10"
            >
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => {
                router.push("/settings");
              }}
              className="cursor-pointer h-10 rounded-xl hover:bg-primary/10"
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer h-10 rounded-xl hover:bg-primary/10"
              onClick={logout}
            >
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
