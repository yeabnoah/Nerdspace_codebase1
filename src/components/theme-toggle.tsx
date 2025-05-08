"use client";

import * as React from "react";
import { Check, Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="bg-white dark:bg-textAlternative mx-auto outline-none outline-transparent after:outline-none"
        >
          <Sun className="absolute size-[1rem] rotate-0 dark:-rotate-90 scale-100 dark:scale-0 transition-all" />
          <Moon className="absolute size-[1rem] rotate-90 dark:rotate-0 scale-0 dark:scale-100 transition-all" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-white/80 dark:bg-black/80 shadow-lg backdrop-blur-sm border-none rounded-2xl w-48"
      >
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setTheme("light");
          }}
          className="hover:bg-black/70 rounded-xl h-10 cursor-pointer"
        >
          <Sun className="mr-2 w-4 h-4" />
          <span>Light</span>
          {theme === "light" && <Check className="ml-auto w-4 h-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setTheme("dark");
          }}
          className="hover:bg-black/70 rounded-xl h-10 cursor-pointer"
        >
          <Moon className="mr-2 w-4 h-4" />
          <span>Dark</span>
          {theme === "dark" && <Check className="ml-auto w-4 h-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setTheme("system");
          }}
          className="hover:bg-black/70 rounded-xl h-10 cursor-pointer"
        >
          <Laptop className="mr-2 w-4 h-4" />
          <span>System</span>
          {theme === "system" && <Check className="ml-auto w-4 h-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
