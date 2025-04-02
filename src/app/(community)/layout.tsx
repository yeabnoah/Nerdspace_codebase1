import { CommunityNavbar } from "@/components/community-navbar";
import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { CommunityProvider } from "@/components/community-provider";
import React from "react";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const handleCreateCommunity = () => {
    // Logic for creating a community
  };

  const [activeView, setActiveView] = React.useState<string>("defaultView");
// thiosadds asddfjkasbdkjasd
  return (
    <CommunityProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
        disableTransitionOnChange
      >
        <div className="full h-full w-full flex-col md:p-3 dark:bg-card">
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
