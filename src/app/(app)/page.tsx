

import { Button } from "@/components/ui/button";
import { HomeIcon, Search } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-row min-h-screen w-full flex-1 items-start justify-center">
      <div className=" hidden sticky top-20 left-0 md:w-fit  lg:w-[17vw]  md:flex md:flex-col px-5 py-5 gap-2">
        <Button variant="outline" className=" gap-3 justify-start bg-transparent">
          <HomeIcon className=" hidden md:block" size={20} />
          <span className=" hidden lg:block">Home</span>
        </Button>
      
        <Button variant="outline" className=" gap-3 justify-start bg-transparent">
          <Search  className=" hidden md:block" size={20} />
          <span className=" hidden lg:block">search</span>
        </Button>
        <Button variant="outline" className=" gap-3 justify-start bg-transparent">
          <HomeIcon  className=" hidden md:block" size={20} />
          <span className=" hidden lg:block">Home</span>
        </Button>
        <Button variant="outline" className=" gap-3 justify-start bg-transparent">
          <HomeIcon  className=" hidden md:block" size={20} />
          <span className=" hidden lg:block">Home</span>
        </Button>
      </div>

      <div className=" flex-1 flex flex-row ">
        <div className=" flex-1 min-h-[200vh] bg-white/40"></div>
        <div className=" lg:w-[17vw]">
        <div className=" hidden md:w-fit sticky top-20 left-0 lg:w-[17vw]  md:flex md:flex-col px-5 py-5 gap-2">
        <Button variant="outline" className=" gap-3 justify-start bg-transparent">
          <HomeIcon className=" hidden md:block" size={20} />
          <span className=" hidden lg:block">Home</span>
        </Button>
      
        <Button variant="outline" className=" gap-3 justify-start bg-transparent">
          <Search  className=" hidden md:block" size={20} />
          <span className=" hidden lg:block">search</span>
        </Button>
        <Button variant="outline" className=" gap-3 justify-start bg-transparent">
          <HomeIcon  className=" hidden md:block" size={20} />
          <span className=" hidden lg:block">Home</span>
        </Button>
        <Button variant="outline" className=" gap-3 justify-start bg-transparent">
          <HomeIcon  className=" hidden md:block" size={20} />
          <span className=" hidden lg:block">Home</span>
        </Button>
      </div>
        </div>
      </div>




      <div className="  md:hidden fixed bottom-0 flex flex-row bg-white dark:bg-textAlternative border px-3 mb-5 py-2 rounded-lg gap-2">
        <Button variant="outline" className=" border-none justify-start bg-transparent">
          <HomeIcon className="  md:block" size={20} />
         
        </Button>
      
        <Button variant="outline" className=" border-none justify-start bg-transparent">
          <Search  className="  md:block" size={20} />
         
        </Button>
        <Button variant="outline" className=" border-none justify-start bg-transparent">
          <HomeIcon  className="  md:block" size={20} />
         
        </Button>
        <Button variant="outline" className=" border-none justify-start bg-transparent">
          <HomeIcon  className="  md:block" size={20} />
         
        </Button>
      </div>
    </div>
  );
}
