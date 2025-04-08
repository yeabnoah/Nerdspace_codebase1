"use client";

import Navbar from "@/components/navbar";
import LeftNavbar from "@/components/navbar/left-navbar";
import MobileNavBar from "@/components/navbar/mobile-nav-bar";
import RightNavbar from "@/components/navbar/right-navbar";
import ExploreRenderPost from "@/components/explore/explore-render-post";
import usePostStore from "@/store/post.store";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "react-hot-toast";

export default function PostPage() {
  const params = useParams();
  const { setSelectedPost, selectedPost } = usePostStore();

  useEffect(() => {
    const fetchPost = async () => {
      if (!params?.id) return;

      try {
        const response = await axios.get(`/api/post/${params.id}`);
        setSelectedPost(response.data.data);
      } catch (error) {
        toast.error("Error loading post");
      }
    };

    fetchPost();
  }, [params?.id, setSelectedPost]);

  if (!selectedPost) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="relative mx-auto flex max-w-6xl flex-1 flex-row items-start">
          <LeftNavbar />
          <div className="my-5 min-h-fit flex-1 pr-5">
            <div className="flex h-[50vh] w-full items-center justify-center">
              Loading...
            </div>
          </div>
          <MobileNavBar />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="relative mx-auto flex max-w-6xl flex-1 flex-row items-start">
        <LeftNavbar />
        <div className="my-5 min-h-fit flex-1 pr-5">
          <ExploreRenderPost selectedPost={selectedPost} />
        </div>
        <RightNavbar />
        <MobileNavBar />
      </div>
    </div>
  );
}
