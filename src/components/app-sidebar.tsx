"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Bell, File, IdCard, User2Icon } from "lucide-react";
import { useState } from "react";
import AccountSetting from "./settings/account-setting";
import NotificationSetting from "./settings/notification-setting";
import ProfileSettings from "./settings/profile-setting";
import ThermsConditions from "./settings/therms-conditions";
import { FaIdCard } from "react-icons/fa";

interface SettingsScreenProps {
  defaultTab?: string;
}

export default function SettingsScreen({ defaultTab = "profile" }: SettingsScreenProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const tabs = [
    {
      id: "profile",
      label: "Profile",
      icon: <User2Icon className="h-5 w-5" />,
      component: <ProfileSettings />,
    },
    {
      id: "account",
      label: "Account",
      icon: <FaIdCard className="h-5 w-5" />,
      component: <AccountSetting />,
    },
    {
      id: "terms",
      label: "Terms & Conditions",
      icon: <File className="h-5 w-5" />,
      component: <ThermsConditions />,
    },
    {
      id: "notification",
      label: "Notification",
      icon: <Bell className="h-5 w-5" />,
      component: <NotificationSetting />,
    },
  ];

  return (
    <div className="flex min-h-screen w-full">
      <div className="fixed left-[10vw] min-h-screen top-[13vh] w-64 border-r border-gray-200 dark:border-gray-500/10 bg-white/50 dark:bg-black/50 p-4 backdrop-blur-sm">
        <div className="mb-8 border-b pb-3">
          <h2 className="text-xl font-geist">Settings</h2>
        </div>
        <nav className="space-y-1">
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={cn(
                "group relative flex w-full h-11 items-center gap-2 rounded-xl px-3 py-2 text-base transition-all duration-300 border-none bg-transparent shadow-none",
                activeTab === tab.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-primary/5 hover:text-primary"
              )}
            >
              {tab.icon}
              {tab.label}
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeIndicator"
                  className="absolute left-0 h-full w-1 rounded-full bg-gradient-to-b from-primary to-primary/50"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                />
              )}
            </motion.button>
          ))}
        </nav>
      </div>
      <div className="ml-64 flex-1 p-8">
        <div className="mx-auto w-[60vw]">
          {tabs.find((tab) => tab.id === activeTab)?.component}
        </div>
      </div>
    </div>
  );
}
