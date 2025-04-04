"use client";

import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Bell, File, IdCard, Search, Settings, User2 } from "lucide-react";
import { useState } from "react";
import ProfileSettings from "./settings/profile-setting";
import AccountSetting from "./settings/account-setting";
import ThermsConditions from "./settings/therms-conditions";
import NotificationSetting from "./settings/notification-setting";

export default function SettingsScreen() {
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    {
      id: "profile",
      label: "Profile",
      icon: <IdCard className="h-5 w-5 text-card-foreground dark:text-white" />,
      component: <ProfileSettings />,
    },
    {
      id: "account",
      label: "Account",
      icon: <User2 className="h-5 w-5 text-card-foreground dark:text-white" />,
      component: <AccountSetting />,
    },
    {
      id: "Therms & conditions",
      label: "Therms & conditions",
      icon: <File className="h-5 w-5 text-card-foreground dark:text-white" />,
      component: <ThermsConditions />,
    },
    {
      id: "notification",
      label: "Notification",
      icon: <Bell className="h-5 w-5 text-card-foreground dark:text-white" />,
      component: <NotificationSetting />,
    },
  ];

  return (
    <div className="my-[3vh] flex h-[80%] min-w-[70vw] flex-col overflow-hidden rounded-xl border dark:border-gray-500/5 text-white md:flex-row">
      {/* Left sidebar */}
      <div className="flex w-full md:w-16 justify-evenly flex-row border-r dark:border-r-gray-500/5 dark:border-zinc-800 md:min-w-60 md:flex-col">
        <div className="hidden items-center justify-between border-b p-4 dark:border-zinc-800 md:flex">
          <h1 className="font-instrument text-2xl text-card-foreground dark:text-white">
            Settings
          </h1>
          <button className="rounded-full p-1 hover:bg-zinc-800">
            <Search className="h-5 w-5 text-zinc-400" />
          </button>
        </div>

        <div className="flex-1 overflow-auto flex flex-row md:flex-col">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-zinc-800/50",
                activeTab === tab.id &&
                  "bg-textAlternative/20 text-card-foreground dark:bg-zinc-800",
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span className="hidden text-card-foreground dark:text-white lg:inline">
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <div className="flex-1 overflow-auto pb-6 md:px-6">
          {tabs.find((tab) => tab.id === activeTab)?.component}
        </div>
      </div>
    </div>
  );
}
