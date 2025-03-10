"use client";

import LeftNavbar from "@/components/navbar/left-navbar";
import MobileNavBar from "@/components/navbar/mobile-nav-bar";
import RightNavbar from "@/components/navbar/right-navbar";
import PostInput from "@/components/post/post-input";
import RenderPOst from "@/components/post/render-post";
import usePostStore from "@/store/post.store";
import { useEffect } from "react";

export default function Home() {
  const { fetchPosts } = usePostStore();

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="mx-auto flex max-w-6xl flex-1 flex-row items-start justify-center">
      <LeftNavbar />
      <div className="my-5 min-h-screen flex-1 md:mx-10">
        <PostInput />
        <RenderPOst />
      </div>

      <RightNavbar />
      <MobileNavBar />
    </div>
  );
}
