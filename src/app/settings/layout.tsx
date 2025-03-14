import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import React from "react";

const ProfileLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <div className="full h-screen w-full flex-col overflow-hidden p-3 dark:bg-textAlternative">
        <Navbar />
        <div className="flex-1">{children}</div>
      </div>
    </ThemeProvider>
  );
};

export default ProfileLayout;
