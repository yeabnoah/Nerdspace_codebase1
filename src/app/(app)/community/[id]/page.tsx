"use client";
import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import LeftNavbar from "@/components/navbar/left-navbar";
import MobileNavBar from "@/components/navbar/mobile-nav-bar";
import { Skeleton } from "@/components/ui/skeleton";

const CommunityDetailsPage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    const unwrapParams = async () => {
      try {
        const resolvedParams = await params; 
        setId(resolvedParams.id); 
        console.log("Resolved ID:", resolvedParams.id); 
      } catch (error) {
        console.error("Error resolving params:", error);
      }
    };
    unwrapParams();
  }, [params]);


  const {
    data: community,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["community-fetch", id],
    queryFn: async () => {
      if (!id) return null;
      try {
        const response = await axios.get(`/api/community?id=${id}`);
        return response.data.data;
      } catch (error) {
        console.error("Error fetching community data:", error);
        return null;
      }
    },
    enabled: !!id,
  });

  if (!id) {
    return (
      <div className="mx-auto flex max-w-6xl flex-1 flex-row items-start justify-center">
        <LeftNavbar />
        <div className="mx-auto min-h-screen w-[70%] px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="mt-4 h-64 w-full" />
          <p>Loading ID...</p>
          <p className="mt-2 text-sm text-gray-500">Debug: ID is not resolved yet.</p>
        </div>
        <MobileNavBar />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto flex max-w-6xl flex-1 flex-row items-start justify-center">
        <LeftNavbar />
        <div className="mx-auto min-h-screen w-[70%] px-4 sm:px-6 lg:px-8">
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="mt-4 h-64 w-full" />
          <p>Loading community data...</p>
        </div>
        <MobileNavBar />
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex max-w-6xl flex-1 flex-row items-start justify-center">
        <LeftNavbar />
        <div className="mx-auto min-h-screen w-[70%] px-4 sm:px-6 lg:px-8">
          <p>Error loading community data.</p>
        </div>
        <MobileNavBar />
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-6xl flex-1 flex-row items-start justify-center">
      <LeftNavbar />
      <div className="mx-auto min-h-screen w-[70%] px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold">{community?.name}</h1>
        <p className="mt-4 text-lg">{community?.description}</p>
        <p className="mt-4 text-sm text-gray-500">Debug: Resolved ID is {id}</p>
      </div>
      <MobileNavBar />
    </div>
  );
};

export default CommunityDetailsPage;
