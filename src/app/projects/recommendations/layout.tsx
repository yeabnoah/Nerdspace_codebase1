import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import React from "react";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <div className="full h-full w-full flex-col dark:bg-card md:p-3">
        <Navbar />
        <div className="">{children}</div>
      </div>
    </ThemeProvider>
  );
};

export default AppLayout;
