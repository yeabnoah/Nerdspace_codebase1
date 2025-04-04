"use client";

import { CommunityNavbar } from "@/components/community-navbar";
import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { CommunityProvider } from "@/components/community-provider";
import React, { useState } from "react";
import useCommunityStore from "@/store/community.store";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const handleCreateCommunity = () => {};

  const { activeView, setActiveView } = useCommunityStore();

  return (
    <CommunityProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <div className="full h-full w-full flex-col dark:bg-card md:p-3">
          <CommunityNavbar
            onCreateCommunity={handleCreateCommunity}
            activeView={activeView}
            setActiveView={setActiveView}
          />
          <div className="">{children}</div>
        </div>
      </ThemeProvider>
    </CommunityProvider>
  );
};

export default AppLayout;
