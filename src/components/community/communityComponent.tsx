"use client";

import { CommunityInterface } from "@/interface/auth/community.interface";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";

const CommunityComponent = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["community"],
    queryFn: async () => {
      const response = await axios.get(`/api/community`);
      return response.data.data;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div>
        {data &&
          data.map((community: CommunityInterface) => (
            <div key={community.id} className="border-b p-4">
              <h2 className="text-xl font-bold">{community.name}</h2>
              <p>{community.description}</p>
              <p>Created by: {community.creator.name}</p>
              <p>Members: {community.members.length}</p>
              <p>Posts: {community.posts.length}</p>
              {community.category && <p>Category: {community.category.name}</p>}
              <p>
                Created At: {new Date(community.createdAt).toLocaleDateString()}
              </p>
            </div>
          ))}
      </div>
    </div>
  );
};

export default CommunityComponent;
