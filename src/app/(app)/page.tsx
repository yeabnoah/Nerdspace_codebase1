"use client";

import LeftNavbar from "@/components/navbar/left-navbar";
import MobileNavBar from "@/components/navbar/mobile-nav-bar";
import RightNavbar from "@/components/navbar/right-navbar";
import PostInput from "@/components/post/post-input";
import RenderPOst from "@/components/post/render-post";
import { authClient } from "@/lib/auth-client";
import { redirect, useRouter } from "next/navigation";

export default function Home() {
  const session = authClient.useSession();
  const router = useRouter();

  if (session && session.data?.user?.image) {
    redirect("/onboarding");
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-1 flex-row items-start justify-center">
      <LeftNavbar />
      <div className="my-5 min-h-fit flex-1 md:mx-10">
        <PostInput />
        <RenderPOst />
      </div>
      <RightNavbar />
      <MobileNavBar />
    </div>
  );
}
