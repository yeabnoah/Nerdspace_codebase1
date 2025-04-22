import LeftNavbar from "@/components/navbar/left-navbar";
import MobileNavBar from "@/components/navbar/mobile-nav-bar";
import RightNavbar from "@/components/navbar/right-navbar";
import PostInput from "@/components/post/post-input";
import RenderPOst from "@/components/post/render-post";

export default function Home() {
  return (
    <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-row items-start ">
      <LeftNavbar />
      <div className="my-5 min-h-fit flex-1 pr-0 md:pr-7">
        <PostInput />
        <RenderPOst />
      </div>
      <RightNavbar />
      <MobileNavBar />
    </div>
  );
}
// console.log the current url