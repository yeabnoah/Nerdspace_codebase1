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
      icon: <IdCard className="h-5 w-5 text-textAlternative dark:text-white" />,
      component: <ProfileSettings />,
    },
    {
      id: "account",
      label: "Account",
      icon: <User2 className="h-5 w-5 text-textAlternative dark:text-white" />,
      component: <AccountSetting />,
    },
    {
      id: "Setting",
      label: "Setting",
      icon: <Settings className="h-5 w-5 text-textAlternative dark:text-white" />,
      component: <ProfileSettings />,
    },
    {
      id: "Therms & conditions",
      label: "Therms & conditions",
      icon: <File className="h-5 w-5 text-textAlternative dark:text-white" />,
      component: <ThermsConditions />,
    },
    {
      id: "notification",
      label: "Notification",
      icon: <Bell className="h-5 w-5 text-textAlternative dark:text-white" />,
      component: <NotificationSetting />,
    },
  ];

  return (
    <div className="my-[3vh] flex h-[80%] min-w-[70vw] overflow-hidden rounded-xl border text-white">
      {/* Left sidebar */}
      <div className="flex min-w-60 flex-col border-r dark:border-zinc-800">
        <div className="flex items-center justify-between border-b dark:border-zinc-800 p-4">
          <h1 className="text-2xl font-instrument text-textAlternative dark:text-white">Settings</h1>
          <button className="rounded-full p-1 hover:bg-zinc-800">
            <Search className="h-5 w-5 text-zinc-400" />
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={cn(
                "flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-zinc-800/50",
                activeTab === tab.id && "dark:bg-zinc-800 bg-textAlternative/20 text-textAlternative",
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span className=" text-textAlternative dark:text-white">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <div className="flex-1 overflow-auto px-6 pb-6">
          {tabs.find((tab) => tab.id === activeTab)?.component}
        </div>
      </div>
    </div>
  );
}
