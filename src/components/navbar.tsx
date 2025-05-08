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
import {
  DialogTitle,
  DialogContent,
  DialogHeader,
} from "@/components/ui/dialog";
import useSearchStore from "@/store/search.store";
import QualityNotice from "./quality-notice";
import NotificationDropdown from "./NotificationDropdown";

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
    <div className="top-0 z-50 sticky flex flex-row justify-between items-center bg-white dark:bg-black mx-auto px-2 md:px-6 py-4 w-full lg:max-w-6xl">
      <div
        onClick={() => {
          router.push("/");
        }}
        className="hover:opacity-80 font-instrument text-card-foreground dark:text-white text-3xl transition-opacity cursor-pointer"
      >
        NerdSpace
      </div>

      <div className="flex justify-center items-center gap-5">
        <div className="hidden md:flex">
          <CommandDialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <DialogTitle></DialogTitle>
            <DialogContent className="bg-white/80 dark:bg-black/80 backdrop-blur-sm p-0 border-none rounded-xl max-w-xl overflow-hidden">
              <DialogHeader className="px-6 pt-4">
                <DialogTitle className="font-geist font-medium text-3xl">
                  Search
                </DialogTitle>
                <p className="font-geist text-muted-foreground">
                  Search for projects, users and more...
                </p>
              </DialogHeader>

              <div className="relative flex flex-col px-6 pb-4">
                {/* Glow effects */}
                {/* <div className="hidden md:block -right-4 absolute bg-gradient-to-br from-blue-300/40 via-blue-400/50 to-transparent backdrop-blur-sm blur-[150px] border border-blue-300/50 rounded-full size-32 -rotate-45"></div> */}
                {/* <div className="hidden md:block -bottom-5 left-12 absolute bg-gradient-to-tl from-orange-300/40 via-orange-400/30 to-transparent backdrop-blur-sm blur-[150px] border border-orange-300/50 rounded-full size-32 rotate-45"></div> */}

                <CommandInput
                  value={query}
                  onValueChange={setQuery}
                  placeholder="Type to search..."
                  className="bg-transparent shadow-none border-input/50 dark:border-gray-500/5 rounded-xl focus-visible:ring-primary/50 h-11 font-geist"
                />

                <CommandList className="mt-4">
                  {query.trim() && (
                    <CommandGroup>
                      <CommandItem
                        onSelect={() => {
                          if (query.trim()) {
                            router.push(
                              `/explore?q=${encodeURIComponent(query)}`,
                            );
                            setIsSearchOpen(false);
                            setQuery("");
                          }
                        }}
                        className="flex items-center gap-2 rounded-xl h-11 font-geist"
                      >
                        <Search className="w-4 h-4" />
                        <span>Search &quot;{query}&quot;</span>
                      </CommandItem>
                    </CommandGroup>
                  )}
                </CommandList>
              </div>
            </DialogContent>
          </CommandDialog>
          <Button
            variant="outline"
            className="relative justify-start sm:pr-12 rounded-xl w-64 md:w-40 lg:w-64 h-11 text-muted-foreground text-sm"
            onClick={() => setIsSearchOpen(true)}
          >
            <span className="inline-flex">Search...</span>
            <kbd className="hidden top-1/2 right-[12px] absolute sm:flex items-center gap-1 bg-muted opacity-100 px-1.5 border rounded h-5 font-mono font-medium text-[10px] -translate-y-1/2 pointer-events-none select-none">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </div>
        <div className="hidden md:flex items-center gap-4">
          <QualityNotice />
          <ModeToggle />
        </div>
        <div className="flex items-center gap-4">
          <NotificationDropdown />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Avatar className="flex justify-center items-center">
                  {isloading ? (
                    <Skeleton className="rounded-full w-8 h-8" />
                  ) : (
                    <>
                      <AvatarImage
                        src={user.image || "/user.jpg"}
                        className="rounded-full size-8 object-cover"
                        alt="@shadcn"
                      />
                      <AvatarFallback className="">
                        <Skeleton className="rounded-full w-8 h-8" />
                      </AvatarFallback>
                    </>
                  )}
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-white/80 dark:bg-black/80 shadow-lg backdrop-blur-sm border-none rounded-2xl w-48"
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="font-medium text-sm">
                    {user.name || session.data?.user.name}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {user.email || session.data?.user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={() => {
                  router.push("/profile");
                }}
                className="hover:bg-black/70 rounded-xl h-10 cursor-pointer"
              >
                <UserIcon className="mr-2 w-4 h-4" />
                <span>Profile</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                onClick={() => {
                  router.push("/settings");
                }}
                className="hover:bg-black/70 rounded-xl h-10 cursor-pointer"
              >
                <Settings className="mr-2 w-4 h-4" />
                <span>Settings</span>
              </DropdownMenuItem>

              
              <DropdownMenuItem
                className="hover:bg-black/70 rounded-xl h-10 cursor-pointer"
                onClick={logout}
              >
                <LogOut className="mr-2 w-4 h-4" />
                <span>Logout</span>
              </DropdownMenuItem>
              
              <DropdownMenuItem className="md:hidden block">
                <ModeToggle />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
