"use client";

import { CommunityInterface } from "@/interface/auth/community.interface";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import CommunityCard from "./communityCard";

const CommunityComponent = () => {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    error,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["community"],
    queryFn: async ({ pageParam }) => {
      const response = await axios.get(`/api/community`, {
        params: { cursor: pageParam, limit: 5 },
      });
      return response.data;
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) =>
      lastPage.data.length > 0
        ? lastPage.data[lastPage.data.length - 1].id
        : null,
  });

  if (isLoading) {
    return (
      <div className="p-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="mb-4 h-20 w-full animate-pulse rounded bg-gray-300"
          ></div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        <p>Error: {error.message}</p>
        <button
          onClick={() => refetch()}
          className="mt-2 rounded bg-red-500 px-4 py-2 text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="">
      {data?.pages.length ? (
        <div className="">
          {data.pages.map((page) =>
            page.data.map((community: CommunityInterface) => (
              <CommunityCard key={community.id} community={community} />
            )),
          )}
        </div>
      ) : (
        <p className="p-4 text-center text-gray-500">No communities found.</p>
      )}

      <div className="mt-4 text-center">
        {hasNextPage && (
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            aria-busy={isFetchingNextPage}
            className={`rounded px-4 py-2 ${
              isFetchingNextPage
                ? "cursor-not-allowed bg-gray-400"
                : "bg-blue-500 hover:bg-blue-600"
            } text-white`}
          >
            {isFetchingNextPage ? "Loading more..." : "Load More"}
          </button>
        )}
      </div>
    </div>
  );
};

export default CommunityComponent;
