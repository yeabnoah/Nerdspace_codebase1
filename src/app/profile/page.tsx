"use client";
import SettingsScreen from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import useUserStore from "@/store/user.store";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const ProfileScreen = () => {
  const { setuser } = useUserStore();
  const { data, isPending } = useQuery({
    queryKey: ["whoami"],
    queryFn: async () => {
      const response = await axios.get("/api/whoami", {
        withCredentials: true,
      });

      setuser(response.data.data);
      return response.data;
    },
  });
  return (
    <SidebarProvider>
      <div className="mx-auto bg-white dark:bg-textAlternative">
        <SettingsScreen />
      </div>
    </SidebarProvider>
  );
};

export default ProfileScreen;
