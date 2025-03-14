"use client";

import React from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { ArrowBigRight, LogOut, Search, UserIcon } from "lucide-react";
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

const Navbar = () => {
  const router = useRouter();
  let loadingToastId: string | undefined;
  const session = authClient.useSession();

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

  const onsubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const searchInput = (
      e.currentTarget.elements.namedItem("search") as HTMLInputElement
    ).value;
    console.log("searching ...");
    router.push(`/search?q=${searchInput}`);
  };

  return (
    <div className="sticky top-0 mx-auto flex max-w-6xl flex-row items-center justify-between bg-white px-2 py-4 dark:bg-textAlternative md:px-6">
      <div
        onClick={() => {
          router.push("/");
        }}
        className="cursor-pointer font-instrument text-3xl text-labelColor transition-opacity hover:opacity-80 dark:text-white"
      >
        NerdSpace
      </div>

      <div className="flex items-center justify-center gap-5">
        <form
          onSubmit={onsubmit}
          className="hidden flex-row items-center justify-center rounded-lg border p-2 md:flex"
        >
          <input
            name="search"
            className="bg-transparent px-2 font-normal outline-none placeholder:text-sm"
            placeholder="looking for something ?"
          />
          <button type="submit" className="bg-transparent">
            <Search className="" size={20} />
          </button>
        </form>
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="flex items-center justify-center">
                <AvatarImage
                  src={session.data?.user?.image || "/user.jpg"}
                  className="size-8 rounded-full ring-2 ring-green-200/50"
                  alt="@shadcn"
                />
                <AvatarFallback className="rounded-full border border-gray-300 p-2">
                  {session.data?.user.name
                    ? session.data.user.name
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .toLowerCase()
                    : "user"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 dark:bg-textAlternative"
          >
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{session.data?.user.name}</p>
                <p className="text-xs text-muted-foreground">
                  {session.data?.user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem onClick={()=>{
              router.push("/profile")
            }} className="cursor-pointer">
              <UserIcon className="mr-2 h-4 w-4" />
              <span>Profile</span>
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
