import LeftNavbar from "@/components/navbar/left-navbar";
import MobileNavBar from "@/components/navbar/mobile-nav-bar";
import RightNavbar from "@/components/navbar/right-navbar";
import PostInput from "@/components/post/post-input";
import RenderPOst from "@/components/post/render-post";

export default function Home() {
  return (
    <div className="relative flex flex-row flex-1 items-start mx-auto w-full max-w-6xl">
      <LeftNavbar />
      <div className="flex-1 my-5 pr-0 md:pr-7 min-h-fit">
        
        <PostInput />
        <RenderPOst />
      </div>
      <RightNavbar />
      <MobileNavBar />
    </div>
  );
}
// console.log the current url