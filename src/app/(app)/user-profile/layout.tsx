import MobileNavBar from "@/components/navbar/mobile-nav-bar";
import LeftNavbar from "@/components/navbar/left-navbar";
import React from "react";

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="mx-auto flex max-w-6xl flex-1 flex-row items-start justify-center">
      <LeftNavbar />
      {children}
      <MobileNavBar />
    </div>
  );
};

export default ProfileLayout;
