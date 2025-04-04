"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/router";
import { useState } from "react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Users } from "lucide-react";

const CommunityDetails = ({ communityId }: { communityId: string }) => {
  const router = useRouter();
  const [cursor, setCursor] = useState<string | null>(null);

  // Fetch community details
  const { data: community, isLoading: isCommunityLoading } = useQuery({
    queryKey: ["community-details", communityId],
    queryFn: async () => {
      const response = await axios.get(`/api/community/${communityId}`);
      return response.data;
    },
  });

  // Fetch community posts
  const { data: posts, isLoading: isPostsLoading } = useQuery({
    queryKey: ["community-posts", communityId, cursor],
    queryFn: async () => {
      const response = await axios.get(`/api/community/${communityId}/posts`, {
        params: { cursor, limit: 10 },
      });
      return response.data;
    },
  });

  const loadMorePosts = () => {
    if (posts && posts.length > 0) {
      setCursor(posts[posts.length - 1].id);
    }
  };

  if (isCommunityLoading) {
    return <Skeleton className="h-12 w-full max-w-md" />;
  }

  return (
    <div className="container mx-auto py-6">
      {/* Community Header */}
      <div className="mb-8">
        <div className="relative h-48 w-full">
          {community.image ? (
            <Image
              src={community.image}
              alt={community.name}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-muted">
              <p className="text-muted-foreground">No Image</p>
            </div>
          )}
        </div>
        <div className="mt-4 flex items-center justify-between">
          <h1 className="text-3xl font-bold">{community.name}</h1>
          <Badge>{community.category?.name || "Uncategorized"}</Badge>
        </div>
        <p className="mt-2 text-muted-foreground">{community.description}</p>
        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{community.members?.length || 0} members</span>
          </div>
        </div>
      </div>

      {/* Community Posts */}
      <div>
        <h2 className="mb-4 text-2xl font-semibold">Posts</h2>
        {isPostsLoading ? (
          <Skeleton className="h-12 w-full max-w-md" />
        ) : posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post: any) => (
              <Card key={post.id}>
                <CardHeader>
                  <CardTitle>{post.content}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>{post.comments?.length || 0} comments</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No posts found.</p>
        )}
        {posts && posts.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Button onClick={loadMorePosts} variant="outline">
              Load More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityDetails;
