

import LeftNavbar from "@/components/navbar/left-navbar";
import MobileNavBar from "@/components/navbar/mobile-nav-bar";
import RightNavbar from "@/components/navbar/right-navbar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { HomeIcon, Search } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-row flex-1 items-start justify-center max-w-6xl mx-auto">
      <LeftNavbar />

      <div className="flex-1 min-h-screen mx-10">
        <Textarea />
      </div>

      <RightNavbar />
      <MobileNavBar />
    </div>
  );
}
