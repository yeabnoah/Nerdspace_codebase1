"use client";

import type { CommunityInterface } from "@/interface/auth/community.interface";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import CommunityCard from "./communityCard";

const CommunityComponent = () => {
  const [data, setData] = useState<CommunityInterface[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/community");
        if (!response.ok) {
          throw new Error("Failed to fetch communities");
        }
        const result = await response.json();
        setData(result.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        {[...Array(3)].map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => {
              setIsLoading(true);
              setError(null);
              setData(null);
            }}
          >
            Retry
          </Button>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">Communities</h1>

      {data && data.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:gap-6">
          {data.map((community: CommunityInterface) => (
            <CommunityCard key={community.id} community={community} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg bg-accent/10 py-12 text-center">
          <h3 className="mb-2 text-xl font-medium">No communities found</h3>
          <p className="mb-4 text-muted-foreground">
            Be the first to create a community!
          </p>
        </div>
      )}
    </div>
  );
};

const SkeletonCard = () => (
  <div className="space-y-3 rounded-lg border p-4">
    <div className="flex items-center gap-3">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-4 w-20" />
      </div>
    </div>
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-3/4" />
    <div className="flex justify-between pt-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-4 w-24" />
    </div>
  </div>
);

export default CommunityComponent;
