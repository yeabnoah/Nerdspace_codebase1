"use client"

import React from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { ArrowBigRight, LogOut, Search, UserIcon } from "lucide-react";
import { ModeToggle } from "./theme-toggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Input } from "./ui/input";

const Navbar = () => {
  const router = useRouter();
  let loadingToastId: string | undefined;
  const session = authClient.useSession()

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
    const searchInput = (e.currentTarget.elements.namedItem('search') as HTMLInputElement).value;
    console.log("searching ...");
    router.push(`/search?q=${searchInput}`);
  };

  return (
    <div className="flex items-center justify-between max-w-6xl flex-row  mx-auto py-4 px-6 sticky top-0 bg-white dark:bg-textAlternative">
      <div className="text-3xl text-labelColor dark:text-white hover:opacity-80 transition-opacity font-instrument cursor-pointer">
        NerdSpace
      </div>

      <div className=" flex items-center justify-center gap-5">
      <form onSubmit={onsubmit} className=" border flex-row p-2 items-center justify-center  rounded-lg hidden md:flex">
        <input name="search" className=" outline-none px-2 placeholder:text-sm font-normal bg-transparent" placeholder="looking for something ?"  />
        <button type="submit" className=" bg-transparent">
          <Search  className="" size={20} />
        </button>
      </form>
      <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar className="flex items-center justify-center">
                <AvatarImage
                  src={session.data?.user?.image || "test"}
                  className=" rounded-full ring-2 ring-green-200/50 size-8"
                  alt="@shadcn"
                />
                <AvatarFallback className="border border-gray-300 p-2 rounded-full">
                  {session.data?.user.name
                    ? session.data.user.name
                      .split(" ")
                      .map(word => word[0])
                      .join("")
                      .toLowerCase()
                    : "user"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="dark:bg-textAlternative w-48">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{session.data?.user.name}</p>
                <p className="text-xs text-muted-foreground">{session.data?.user.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
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
