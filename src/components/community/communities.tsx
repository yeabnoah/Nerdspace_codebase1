"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { Skeleton } from "../ui/skeleton";
import { CommunityInterface } from "@/interface/auth/community.interface";
import { Card, CardContent, CardDescription, CardFooter } from "../ui/card";
import Image from "next/image";

const CommunityManager = () => {
  const { data: communities, isLoading } = useQuery<CommunityInterface[]>({
    queryKey: ["communities"],
    queryFn: async () => {
      const response = await axios.get("/api/community");

      return response.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="mx-auto flex flex-row flex-wrap gap-5">
        {[1, 2, 3, 4, 5, 6].map((each, index) => {
          return <Skeleton key={index} className="h-52 w-64"></Skeleton>;
        })}
      </div>
    );
  }

  {
    communities && communities?.length < 0 && <div>No communities Found</div>;
  }

  return (
    <div>
      <div>
        <div className="flex flex-row flex-wrap gap-3">
          {communities &&
            communities.map((each, index) => {
              return (
                <Card key={index}>
                  <CardContent>
                    <Image
                      src={each.image || "/user.jpg"}
                      width={300}
                      height={300}
                      alt={each.name}
                    />
                    <CardDescription>{each.description}</CardDescription>
                    <CardFooter>{each.name}</CardFooter>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default CommunityManager;
