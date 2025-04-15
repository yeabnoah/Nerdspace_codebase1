"use client";

import SettingsScreen from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const ProfileScreenContent = () => {
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

const ProfileScreen = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProfileScreenContent />
    </Suspense>
  );
};

export default ProfileScreen;
