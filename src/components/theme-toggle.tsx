"use client"

import * as React from "react"
import { Check, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
    const { setTheme , theme} = useTheme()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="dark:bg-textAlternative mx-auto bg-white outline-transparent outline-none after:outline-none">
                    <Sun className=" size-[1rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute size-[1rem]  rotate-90  scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className=" dark:bg-textAlternative ">
                <DropdownMenuItem onClick={() => setTheme("light")} className=" flex items-center justify-between">
                    Light
                    {theme === "light" && <Check className=" bg-textAlternative/20 p-1 dark:bg-white/60 dark:text-black rounded-full" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className=" flex items-center justify-between">
                    Dark
                    {theme === "dark" && <Check className=" bg-textAlternative/20 p-1 dark:bg-white/60 rounded-full dark:text-black" />}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")} className=" flex items-center justify-between ">
                    System
                    {theme === "system" && <Check className=" bg-textAlternative/20 p-1 dark:bg-white/60 rounded-full dark:text-black" />}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
