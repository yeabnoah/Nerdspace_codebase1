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
      <div className="full h-full w-full flex-col p-3 dark:bg-textAlternative">
        <Navbar />
        <div className="">{children}</div>
      </div>
    </ThemeProvider>
  );
};

export default AppLayout;
