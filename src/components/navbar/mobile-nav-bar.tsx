import { HammerIcon, HomeIcon, Search, Settings, Users } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";

const MobileNavBar = () => {
  return (
    <div className="fixed bottom-0 flex h-12 w-full flex-row items-center justify-evenly gap-2 bg-white shadow-lg dark:bg-textAlternative md:hidden">
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
