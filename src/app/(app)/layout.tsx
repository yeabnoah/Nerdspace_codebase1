import Navbar from "@/components/navbar";
import React from "react";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="con h-full w-full flex-col dark:bg-black lg:p-3">
      {/* <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 h-full w-full bg-gradient-to-br from-[#1f1f1f] via-[#2a2a3c] to-[#0f0f11] opacity-80"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed left-[-10%] top-[-20%] h-[400px] w-[400px] rounded-full bg-purple-500 opacity-30 blur-[150px]"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed bottom-[-20%] right-[-10%] h-[400px] w-[400px] rounded-full bg-pink-600 opacity-20 blur-[150px]"
      /> */}
      <Navbar />
      <div className="">{children}</div>
    </div>
  );
};

export default AppLayout;
