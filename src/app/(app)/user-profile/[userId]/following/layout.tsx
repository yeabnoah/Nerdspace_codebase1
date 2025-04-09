import Navbar from "@/components/navbar";
import React from "react";

const FollowingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="full h-full w-full flex-col dark:bg-black md:p-3">
      <Navbar />
      <div className="">{children}</div>
    </div>
  );
};

export default FollowingLayout; 