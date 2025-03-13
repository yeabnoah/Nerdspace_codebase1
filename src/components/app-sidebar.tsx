"use client"

import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import axios from "axios"
import { Bell, File, IdCard, Search, Settings, User2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
// import { CountrySelector } from "@/components/country-selector";
import { useFormStore } from "../store/useFormStore"
import Step1 from "./steps/Step1"
import Step2 from "./steps/Step2"
import Step3 from "./steps/Step3"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Form } from "./ui/form"

const FormSchema = z.object({
  country: z.string({
    required_error: "Please select a country",
  }),
});

type FormSchema = z.infer<typeof FormSchema>;

const ProfileSettings = () => {
  const {
    selectedCountry,
    selectedImage,
    nerdAt,
    bio,
    displayName,
    link,
    setSelectedCountry,
    setSelectedImage,
    setNerdAt,
    setBio,
    setDisplayName,
    setLink,
  } = useFormStore();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const mutation = useMutation({
    mutationKey: ["update-user"],
    mutationFn: async () => {
      const response = await axios.patch(
        "/api/onboarding",
        {
          country: selectedCountry,
          image: selectedImage,
          nerdAt,
          bio,
          displayName,
          link,
          firstTime: false,
        },
        { withCredentials: true },
      );

      return response.data;
    },
    onSuccess: () => {
      toast.success("Data successfully updated");
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || "An error occurred while onboarding";
      toast.error(errorMessage);
    },
  });

  return (
    <Card className="preview-card border-none bg-transparent shadow-none">
      <CardHeader>
        <CardTitle>Profile Settings</CardTitle>
        <CardDescription>Please provide accurate information</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(() => mutation.mutate())}
            className="w-full space-y-4"
          >
            <Step1
              selectedCountry={selectedCountry}
              setSelectedCountry={setSelectedCountry}
              selectedImage={selectedImage}
              setSelectedImage={setSelectedImage}
            />
            <Step2
              nerdAt={nerdAt}
              setNerdAt={setNerdAt}
              bio={bio}
              setBio={setBio}
            />
            <Step3
              displayName={displayName}
              setDisplayName={setDisplayName}
              link={link}
              setLink={setLink}
            />
            <div className="flex justify-end">
              <Button type="submit">
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default function SettingsScreen() {
  const [activeTab, setActiveTab] = useState("chat")

  const tabs = [
    { id: "profile", label: "Profile", icon: <IdCard className="w-5 h-5" /> },
    { id: "account", label: "Account", icon: <User2 className="w-5 h-5" /> },
    { id: "Setting", label: "Setting", icon: <Settings className="w-5 h-5" /> },
    { id: "Therms & conditions", label: "Therms & conditions", icon: <File className="w-5 h-5" /> },
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
          {activeTab === "profile" && <ProfileSettings />}
        </div>
      </div>
    </div>
  )
}

