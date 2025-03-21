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
      {children}
    </ThemeProvider>
  );
};

export default ProfileLayout;
