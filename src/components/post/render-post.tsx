"use client";

import { timeAgo } from "@/functions/calculate-time-difference";
import fetchPosts from "@/functions/fetch-post";
import usePostStore from "@/store/post.store";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { BookmarkIcon, Heart, MessageCircle } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Skeleton } from "../ui/skeleton";
import { Card } from "../ui/card";

const RenderPost = () => {
  const { ref, inView } = useInView();

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const trimLimits = {
    sm: 30,
    md: 20,
    lg: 55,
  };

  const [expandedStates, setExpandedStates] = useState<boolean[]>(
    Array(data?.pages?.flatMap((page) => page.data)?.length).fill(false),
  );

  const toggleExpand = (index: number) => {
    setExpandedStates((prev) => {
      const newExpandedStates = [...prev];
      newExpandedStates[index] = !newExpandedStates[index];
      return newExpandedStates;
    });
  };

  const getTrimLimit = () => {
    if (window.innerWidth < 640) {
      return trimLimits.sm;
    } else if (window.innerWidth >= 640 && window.innerWidth < 1024) {
      return trimLimits.md;
    } else {
      return trimLimits.lg;
    }
  };

  if (isLoading) {
    return (
      <div>
        <Card className="my-5 rounded-xl border bg-transparent p-4 shadow-none">
          <div className="flex items-center gap-5">
            <Skeleton className="size-10 rounded-full" />
            <div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-1 h-3 w-16" />
            </div>
          </div>
          <Skeleton className="mt-4 h-16 w-full" />
          <div className="mt-4 flex gap-3">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
        </Card>
        <Card className="my-5 rounded-xl border bg-transparent p-4 shadow-none">
          <div className="flex items-center gap-5">
            <Skeleton className="size-10 rounded-full" />
            <div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-1 h-3 w-16" />
            </div>
          </div>
          <Skeleton className="mt-4 h-16 w-full" />
          <div className="mt-4 flex gap-3">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
        </Card>
        <Card className="my-5 rounded-xl border bg-transparent p-4 shadow-none">
          <div className="flex items-center gap-5">
            <Skeleton className="size-10 rounded-full" />
            <div>
              <Skeleton className="h-4 w-24" />
              <Skeleton className="mt-1 h-3 w-16" />
            </div>
          </div>
          <Skeleton className="mt-4 h-16 w-full" />
          <div className="mt-4 flex gap-3">
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 w-6 rounded-full" />
            <Skeleton className="h-6 w-6 rounded-full" />
          </div>
        </Card>
      </div>
    );
  }

  if (data && data.pages.flatMap((page) => page.data).length === 0) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        No posts available
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        Error loading posts
      </div>
    );
  }

  return (
    <div>
      {data?.pages
        .flatMap((page) => page.data)
        .map((each, index) => {
          const contentWords = each.content.split(" ");
          const trimLimit = getTrimLimit();
          const truncatedContent = contentWords.slice(0, trimLimit).join(" ");
          const isLongContent = contentWords.length > trimLimit;
          const isShortContent = contentWords.length < trimLimit;
          const isTooShort = contentWords.length < 10;

          inView && hasNextPage && fetchNextPage();

          return (
            <div className="my-5 rounded-xl border p-4" key={index}>
              <div className="flex items-center gap-5">
                <Image
                  src={each.user.image || "/user.jpg"}
                  alt="user"
                  className="size-10 rounded-full"
                  height={200}
                  width={200}
                />

                <div>
                  <h1 className="text-sm">{each.user.name}</h1>
                  <h1 className="text-xs">{timeAgo(each.createdAt)}</h1>
                </div>
              </div>

              <div
                className={`mt-2 flex ${isShortContent && isTooShort ? "flex-col" : "flex-row"} items-start justify-center`}
              >
                <div className="flex-1">
                  <h4 className="text-xs md:text-sm">
                    {expandedStates[index] || !isLongContent
                      ? each.content
                      : `${truncatedContent}...`}
                  </h4>
                  {isLongContent && (
                    <button
                      className="mt-2 text-xs underline"
                      onClick={() => toggleExpand(index)}
                    >
                      {expandedStates[index] ? "See less" : "See more"}
                    </button>
                  )}
                </div>

                <div
                  className={`flex ${isShortContent && isTooShort ? "mt-5 flex-row" : "flex-col"} gap-5`}
                >
                  <div
                    className={`rounded-full ${isShortContent && isTooShort ? "pr-2" : "px-2"}`}
                  >
                    <Heart className="size-5" />
                  </div>
                  <div
                    className={`rounded-full ${isShortContent && isTooShort ? "pr-2" : "px-2"}`}
                  >
                    <MessageCircle className="size-5" />
                  </div>
                  <div
                    className={`rounded-full ${isShortContent && isTooShort ? "pr-2" : "px-2"}`}
                  >
                    <BookmarkIcon className="size-5" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      <div ref={ref}>
        {isFetchingNextPage && (
          <div className="">
            <Card className="my-5 rounded-xl border shadow-none bg-transparent p-4">
              <div className="flex items-center gap-5">
                <Skeleton className="size-10 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="mt-1 h-3 w-16" />
                </div>
              </div>
              <Skeleton className="mt-4 h-16 w-full" />
              <div className="mt-4 flex gap-3">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
            </Card>
            {/* <Card className="my-5 rounded-xl border bg-transparent p-4 shadow-none">
              <div className="flex items-center gap-5">
                <Skeleton className="size-10 rounded-full" />
                <div>
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="mt-1 h-3 w-16" />
                </div>
              </div>
              <Skeleton className="mt-4 h-16 w-full" />
              <div className="mt-4 flex gap-3">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
            </Card> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default RenderPost;
