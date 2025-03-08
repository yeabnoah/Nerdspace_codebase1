"use client"

import LeftNavbar from "@/components/navbar/left-navbar";
import MobileNavBar from "@/components/navbar/mobile-nav-bar";
import RightNavbar from "@/components/navbar/right-navbar";
import RenderPOst from "@/components/post/render-post";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import usePostStore from "@/store/post.store";
import { HomeIcon, Search } from "lucide-react";
import { use, useState } from "react";

export default function Home() {

  const [post, setPost] = useState<string>("");
  // const postSubmit = () => {
  //   console.log(post);
  // }
  const {fetchPosts} = usePostStore()

  return (
    <div className="flex flex-row flex-1 items-start justify-center max-w-6xl mx-auto">
      <LeftNavbar />
      <div className="flex-1 min-h-screen md:mx-10 my-5">
        <Textarea 
        placeholder=" what's on your mind ?"
        className="w-full h-14 text-sm md:text-base font-inter"
        value={post} onChange={(e)=>{
          setPost(e.target.value);
        }} 
        />
        <Button onClick={fetchPosts} className=" itemright mt-3 h-8">
          Post
        </Button>

        <RenderPOst />
      </div>

      <RightNavbar />
      <MobileNavBar />
    </div>
  );
}
