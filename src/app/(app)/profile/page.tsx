import LeftNavbar from "@/components/navbar/left-navbar";
import MobileNavBar from "@/components/navbar/mobile-nav-bar";
import RightNavbar from "@/components/navbar/right-navbar";
import PostInput from "@/components/post/post-input";
import RenderPOst from "@/components/post/render-post";
import ProfilePage from "@/components/settings/profile";

export default function Profile() {
  
  return (
    <div className="mx-auto flex max-w-6xl flex-1 flex-row items-start justify-center">
      <LeftNavbar />
      <ProfilePage />
      <MobileNavBar />
    </div>
  );
}
