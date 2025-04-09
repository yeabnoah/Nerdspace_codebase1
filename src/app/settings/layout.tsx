import Navbar from "@/components/navbar";
import React from "react";

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="full h-screen overflow-y-scroll w-full flex-col overflow-hidden p-3 dark:bg-textAlternative">
      <Navbar />
      <div className="flex-1">{children}</div>
    </div>
  );
};

export default ProfileLayout;
