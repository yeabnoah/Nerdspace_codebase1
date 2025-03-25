"use client";

import {
  Bookmark,
  Clock,
  Computer,
  HomeIcon,
  Search,
  TrendingUp,
  Users,
} from "lucide-react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";

const LeftNavbar = () => {
  const router = useRouter();
  return (
    <div className="sticky left-0 top-20 hidden gap-2 px-5 py-5 md:flex md:w-fit md:flex-col lg:w-[17vw]">
      <Button
        onClick={() => {
          router.push("/");
        }}
        variant="outline"
        className="justify-start gap-3 border-gray-100 bg-transparent shadow-none dark:border-gray-500/5"
      >
        <HomeIcon className="hidden md:block" size={20} />
        <span className="hidden lg:block">Home</span>
      </Button>
      <Button
        onClick={() => {
          router.push("/search");
        }}
        variant="outline"
        className="justify-start gap-3 border-gray-100 bg-transparent shadow-none dark:border-gray-500/5"
      >
        <Search className="hidden md:block" size={20} />
        <span className="hidden lg:block">search</span>
      </Button>
      <Button
        onClick={() => {
          router.push("/communities");
        }}
        variant="outline"
        className="justify-start gap-3 border-gray-100 bg-transparent shadow-none dark:border-gray-500/5"
      >
        <Users className="hidden md:block" size={20} />
        <span className="hidden lg:block">Communities</span>
      </Button>
      <Button
        onClick={() => {
          router.push("/explore");
        }}
        variant="outline"
        className="justify-start gap-3 border-gray-100 bg-transparent shadow-none dark:border-gray-500/5"
      >
        <TrendingUp className="hidden md:block" size={20} />
        <span className="hidden lg:block">Explore</span>
      </Button>
      <Button
        onClick={() => {
          router.push("/bookmarks");
        }}
        variant="outline"
        className="justify-start gap-3 border-gray-100 bg-transparent shadow-none dark:border-gray-500/5"
      >
        <Bookmark className="hidden md:block" size={20} />
        <span className="hidden lg:block">Bookmark</span>
      </Button>
      <Button
        onClick={() => {
          router.push("/events");
        }}
        variant="outline"
        className="justify-start gap-3 border-gray-100 bg-transparent shadow-none dark:border-gray-500/5"
      >
        <Clock className="hidden md:block" size={20} />
        <span className="hidden lg:block">Events</span>
      </Button>
      <Button
        variant="outline"
        className="justify-start gap-3 border-gray-100 bg-transparent shadow-none dark:border-gray-500/5"
      >
        <Computer className="hidden md:block" size={20} />
        <span className="hidden lg:block">Nerd AI</span>
      </Button>
    </div>
  );
};

export default LeftNavbar;
