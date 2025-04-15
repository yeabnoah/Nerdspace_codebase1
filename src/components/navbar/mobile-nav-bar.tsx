import { HammerIcon, HomeIcon, Search, Settings, Users } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

const MobileNavBar = () => {
  return (
    <div className="fixed max-w-full left-0 w-screen  bottom-0 flex z-40 h-12 flex-row items-center justify-evenly gap-2 bg-white shadow-lg dark:bg-black md:hidden">
      <Button
        variant="outline"
        className="flex-1 justify-center border-none bg-transparent"
      >
        <HomeIcon size={24} />
      </Button>
      <Button
        variant="outline"
        className="flex-1 justify-center border-none bg-transparent"
      >
        <Search size={24} />
      </Button>
      <Button
        variant="outline"
        className="flex-1 justify-center border-none bg-transparent"
      >
        <HammerIcon size={24} />
      </Button>
      <Button
        variant="outline"
        className="flex-1 justify-center border-none bg-transparent"
      >
        <Users size={24} />
      </Button>
      <Button
        variant="outline"
        className="flex-1 justify-center border-none bg-transparent"
      >
        <Settings size={24} />
      </Button>
    </div>
  );
};

export default MobileNavBar;
