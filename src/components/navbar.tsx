"use client"

import React from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { ArrowBigRight, LogOut, UserIcon } from "lucide-react";
import { ModeToggle } from "./theme-toggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";

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

  return (
    <div className="flex items-center justify-between flex-row max-w-5xl mx-auto py-4 px-6">
      <div className="text-3xl text-labelColor dark:text-white hover:opacity-80 transition-opacity font-instrument cursor-pointer">
        NerdSpace
      </div>
      <div className=" flex items-center justify-center gap-5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage
                  src={session.data?.user?.image || "test"}
                  className="size-9 rounded-full ring-2 ring-green-200/50"
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
        <ModeToggle />
      </div>
    </div>
  );
};

export default Navbar;
