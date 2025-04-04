"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { Skeleton } from "../ui/skeleton";

const CommunityManager = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["communities"],
    queryFn: async () => {
      const response = await axios.get("/api/community");

      return response.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex flex-row gap-5 flex-wrap mx-auto">
        {[1, 2, 3, 4, 5, 6].map((each, index) => {
          return <Skeleton key={index} className="h-52 w-64"></Skeleton>;
        })}
      </div>
    );
  }
  return <div>CommunityManager</div>;
};

export default CommunityManager;
