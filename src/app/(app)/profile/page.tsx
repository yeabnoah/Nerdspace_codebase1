import LeftNavbar from "@/components/navbar/left-navbar";
import MobileNavBar from "@/components/navbar/mobile-nav-bar";
import ProfilePage from "@/components/settings/profile";

export default function Profile() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-row items-start px-4 md:px-0">
      <LeftNavbar />
      <div className="flex min-h-fit flex-1 flex-row items-start px-[.3px]">
        <ProfilePage />
      </div>

      <MobileNavBar />
    </div>
  );
}
