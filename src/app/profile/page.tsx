import SettingsScreen from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const ProfileScreen = () => {
  return (
    <SidebarProvider>
      <div className=" bg-white dark:bg-textAlternative mx-auto">
        <SettingsScreen />
      </div>
    </SidebarProvider>
  );
};

export default ProfileScreen;
