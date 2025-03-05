"use client"

import LeftNavbar from "@/components/navbar/left-navbar";
import MobileNavBar from "@/components/navbar/mobile-nav-bar";
import RightNavbar from "@/components/navbar/right-navbar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { HomeIcon, Search } from "lucide-react";
import { use, useState } from "react";

export default function Home() {

  const [post, setPost] = useState<string>("");

  const postSubmit = () => {
    console.log(post);
  }

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
        <Button onClick={postSubmit} className=" itemright mt-3 h-8">
          Post
        </Button>
      </div>

      <RightNavbar />
      <MobileNavBar />
    </div>
  );
}
