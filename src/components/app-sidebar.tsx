"use client"

import { useState } from "react"
import { Bell, Computer, MessageCircle, Search, Settings, User, Video, X } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

export default function SettingsScreen() {
  const [activeTab, setActiveTab] = useState("chat")

  const tabs = [
    { id: "profile", label: "Profile", icon: <User className="w-5 h-5" /> },
    { id: "account", label: "Account", icon: <Settings className="w-5 h-5" /> },
    { id: "chat", label: "Chat", icon: <MessageCircle className="w-5 h-5" /> },
    { id: "voice", label: "Voice & Video", icon: <Video className="w-5 h-5" /> },
    { id: "appearance", label: "Appearance", icon: <Computer className="w-5 h-5" /> },
    { id: "notification", label: "Notification", icon: <Bell className="w-5 h-5" /> },
  ]

  const chatSettings = [
    {
      id: "enterSend",
      title: "Use 'Enter' as send",
      description: "",
      enabled: true,
    },
    {
      id: "renderImage",
      title: "Render image",
      description: "Automatically showed image",
      enabled: true,
    },
    {
      id: "emoticons",
      title: "Convert to emoticons",
      description: "Change any symbols that related to emoticons",
      enabled: false,
    },
    {
      id: "embeddedContent",
      title: "Display embedded content and preview URLs pasted into chat",
      description: "",
      enabled: true,
    },
    {
      id: "textSuggestion",
      title: "Text suggestion",
      description: "",
      enabled: false,
    },
    {
      id: "autoCorrection",
      title: "Auto correction",
      description: "",
      enabled: false,
    },
  ]

  return (
      <div className="flex h-[80%] overflow-hidden min-w-[70vw] my-[3vh] rounded-xl border text-white">
      {/* Left sidebar */}
      <div className=" min-w-60 border-r border-zinc-800 flex flex-col">
        <div className="p-4 flex items-center justify-between border-b border-zinc-800">
          <h1 className="text-xl font-semibold">Settings</h1>
          <button className="rounded-full p-1 hover:bg-zinc-800">
            <Search className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        <div className="flex-1 overflow-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-zinc-800/50 transition-colors",
                activeTab === tab.id && "bg-zinc-800",
              )}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <div className="flex justify-end p-4">
          <button className="rounded-full p-1 hover:bg-zinc-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto px-6 pb-6">
          {activeTab === "chat" && (
            <div className="space-y-8">
              {chatSettings.map((setting) => (
                <div key={setting.id} className="flex items-start justify-between">
                  <div>
                    <h3 className="text-white">{setting.title}</h3>
                    {setting.description && <p className="text-sm text-zinc-400 mt-1">{setting.description}</p>}
                  </div>
                  <Switch
                    checked={setting.enabled}
                    onCheckedChange={() => {}}
                    className="data-[state=checked]:bg-emerald-500"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

