"use client";

import SettingsScreen from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useSearchParams } from "next/navigation";

const ProfileScreen = () => {
  const searchParams = useSearchParams();
  const tab = searchParams?.get("tab") || "profile";

  return (
    <SidebarProvider>
      <div className="mx-auto bg-white dark:bg-black ">
        <SettingsScreen defaultTab={tab} />
      </div>
    </SidebarProvider>
  );
};

export default ProfileScreen;
