import SettingsScreen from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const ProfileScreen = () => {

  return (
    <SidebarProvider>
      <div className="mx-auto bg-white dark:bg-textAlternative">
        <SettingsScreen />
      </div>
    </SidebarProvider>
  );
};

export default ProfileScreen;
