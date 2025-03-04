

import LeftNavbar from "@/components/navbar/left-navbar";
import MobileNavBar from "@/components/navbar/mobile-nav-bar";
import RightNavbar from "@/components/navbar/right-navbar";
import { Button } from "@/components/ui/button";
import { HomeIcon, Search } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-row w-full flex-1 items-start justify-center">
      <LeftNavbar />

      {/* Removed bg-yellow-400 */}
      <div className="flex-1 min-h-screen bg-teal-300">
        {/* Your main content goes here */}
      </div>

      <RightNavbar />
      <MobileNavBar />
    </div>
  );
}
