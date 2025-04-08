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
import { Skeleton } from "@/components/ui/skeleton";

export default function PostPage() {
  const params = useParams();
  const { setSelectedPost, selectedPost } = usePostStore();

  useEffect(() => {
    const fetchPost = async () => {
      if (!params?.id) return;

      try {
        const response = await axios.get(`/api/post/${params.id}`);
        const postData = response.data.data;
        // Ensure bookmarks array exists
        if (!postData.bookmarks) {
          postData.bookmarks = [];
        }
        setSelectedPost(postData);
      } catch (error) {
        toast.error("Error loading post");
      }
    };

    fetchPost();
  }, [params?.id, setSelectedPost]);

  if (!selectedPost) {
    return (
      <div className="min-h-screen bg-white dark:bg-black">
        <Navbar />
        <div className="relative mx-auto flex max-w-6xl flex-1 flex-row items-start">
          <LeftNavbar />
          <div className="my-5 min-h-fit flex-1 pr-5">
            <div className="space-y-4">
              {/* Post Header Skeleton */}
              <div className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-3 w-[150px]" />
                </div>
              </div>

              {/* Post Content Skeleton */}
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[90%]" />
                <Skeleton className="h-4 w-[80%]" />
              </div>

              {/* Post Media Skeleton */}
              <Skeleton className="aspect-square w-full rounded-lg" />

              {/* Post Actions Skeleton */}
              <div className="flex items-center space-x-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          </div>
          <MobileNavBar />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black">
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
