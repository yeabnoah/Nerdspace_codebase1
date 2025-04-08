import LeftNavbar from "@/components/navbar/left-navbar";
import MobileNavBar from "@/components/navbar/mobile-nav-bar";
import RightNavbar from "@/components/navbar/right-navbar";
import PostInput from "@/components/post/post-input";
import RenderPOst from "@/components/post/render-post";

export default function Home() {
  return (
    <div className="relative mx-auto flex max-w-6xl flex-1 flex-row items-start">
      <LeftNavbar />
      <div className="relative my-5 min-h-fit flex-1 pr-5 before:absolute before:left-0 before:h-full before:w-[1px] before:bg-gradient-to-b before:from-transparent before:via-blue-600 before:to-transparent after:absolute after:right-0 after:h-full after:w-[1px] after:bg-gradient-to-b after:from-transparent after:via-blue-600 after:to-transparent">
        <RenderPOst />
      </div>
      <RightNavbar />
      <MobileNavBar />
    </div>
  );
}
