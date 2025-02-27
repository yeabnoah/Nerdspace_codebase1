import Navbar from "@/components/navbar";
import React from "react";

const AppLayout = ({ children }: { children: React.ReactNode }) => {



  return (
    <div className="full h-full w-full flex-col p-3 dark:bg-textAlternative">
      <Navbar />
      <div className="">{children}</div>
    </div>
  );
};

export default AppLayout;
