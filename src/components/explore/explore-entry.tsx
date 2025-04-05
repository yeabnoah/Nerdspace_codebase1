"use client";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import { MessageSquare, Heart, Clock, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ExploreEntry = () => {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/explore?q=${query}&type=${type}`);
      if (!response.ok) {
        throw new Error("Failed to fetch results");
      }
      const data = await response.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="mb-4 font-instrument text-3xl">Explore</h1>
      <div className="mb-6 flex items-center gap-4">
        <Input
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full"
        />
        <Select value={type} onValueChange={(value) => setType(value)}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="user">Users</SelectItem>
            <SelectItem value="post">Posts</SelectItem>
            <SelectItem value="project">Projects</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? "Searching..." : "Search"}
        </Button>
      </div>
      {error && <p className="text-red-500">{error}</p>}
      {results && (
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="posts">Posts</TabsTrigger>
            <TabsTrigger value="projects">Projects</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            <div className="space-y-6">
              {results.users && <UsersCard users={results.users} />}
              {results.posts && <PostsCard posts={results.posts} />}
              {results.projects && <ProjectsCard projects={results.projects} />}
            </div>
          </TabsContent>

          <TabsContent value="users">
            {results.users && <UsersCard users={results.users} />}
          </TabsContent>

          <TabsContent value="posts">
            {results.posts && <PostsCard posts={results.posts} />}
          </TabsContent>

          <TabsContent value="projects">
            {results.projects && <ProjectsCard projects={results.projects} />}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

const UsersCard = ({ users }: { users: any[] }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
    {users.map((user) => (
      <Card
        key={user.id}
        className="transition-shadow duration-300 hover:shadow-md"
      >
        <CardHeader className="flex flex-row items-center gap-4">
          {user.image && (
            <img
              src={user.image}
              alt={user.name}
              className="h-12 w-12 rounded-full object-cover"
            />
          )}
          <div>
            <CardTitle className="text-base">{user.name}</CardTitle>
            <p className="text-sm text-muted-foreground">@{user.nerdAt}</p>
          </div>
        </CardHeader>
      </Card>
    ))}
  </div>
);

const PostsCard = ({ posts }: { posts: any[] }) => {
  const [expandedPosts, setExpandedPosts] = useState<{
    [key: string]: boolean;
  }>({});

  const toggleExpand = (postId: string) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const getGridClass = (mediaCount: number) => {
    switch (mediaCount) {
      case 1:
        return "grid-cols-1";
      case 2:
        return "grid-cols-2";
      case 3:
      case 4:
        return "grid-cols-2";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-6">
      {posts.map((post) => {
        const isExpanded = expandedPosts[post.id];
        const contentWords = post.content.split(" ");
        const trimLimit = 20; // Adjust trim limit as needed
        const truncatedContent = contentWords.slice(0, trimLimit).join(" ");
        const isLongContent = contentWords.length > trimLimit;

        return (
          <Card
            key={post.id}
            className="overflow-hidden border border-gray-100 p-4 dark:border-gray-500/5"
          >
            <div className="flex items-center gap-3 pb-4">
              {post.user?.image && (
                <Image
                  src={post.user.image}
                  alt={post.user.name || "User"}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <div>
                <p className="text-sm font-medium">{post.user?.name}</p>
                <p className="text-xs text-muted-foreground">
                  @{post.user?.nerdAt}
                </p>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-sm">
                {isExpanded || !isLongContent
                  ? post.content
                  : `${truncatedContent}...`}
              </p>
              {isLongContent && (
                <button
                  className="mt-2 text-xs underline"
                  onClick={() => toggleExpand(post.id)}
                >
                  {isExpanded ? "See less" : "See more"}
                </button>
              )}
            </div>
            {post.shared && (
              <Card className="overflow-hidden border-gray-100 opacity-80 shadow-none transition-all hover:cursor-pointer hover:opacity-100 dark:border-gray-500/5">
                <div className="flex gap-3">
                  <div className="relative h-48 w-full sm:h-auto sm:w-1/3">
                    <Image
                      fill
                      src={post.project?.image || "/placeholder.svg"}
                      alt={post.project?.name || "Project"}
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 33vw"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-4">
                    <div className="space-y-2">
                      <h3 className="font-medium tracking-tight">
                        {post.project?.name}
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        <Badge
                          variant="outline"
                          className="bg-primary/5 text-xs font-normal"
                        >
                          {post.project?.status}
                        </Badge>
                        {post.project?.category && (
                          <Badge
                            variant="outline"
                            className="bg-primary/5 text-xs font-normal"
                          >
                            {post.project?.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{post.project?._count.updates}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="h-3.5 w-3.5" />
                        <span>{post.project?._count.stars}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span>{post.project?._count.reviews}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}
            {post.media?.length > 0 && (
              <div
                className={`grid w-[100%] flex-1 gap-2 ${getGridClass(
                  post.media.length,
                )}`}
              >
                {post.media.length === 1 && (
                  <div className="relative h-[30vh] md:h-[36vh]">
                    <Image
                      fill
                      src={post.media[0].url}
                      alt="Post media"
                      className="w-full rounded-xl object-cover"
                    />
                  </div>
                )}
                {post.media.length === 2 &&
                  post.media.map((media, mediaIndex) => (
                    <div
                      key={media.id}
                      className="relative h-[20vh] md:h-[28vh]"
                    >
                      <Image
                        fill
                        src={media.url}
                        alt="Post media"
                        className="h-full w-full rounded-xl object-cover"
                      />
                    </div>
                  ))}
                {post.media.length >= 3 && (
                  <div className="grid h-[36vh] w-[82vw] grid-cols-[auto_120px] gap-2 md:w-[36vw]">
                    <div className="relative h-full w-full">
                      <Image
                        fill
                        src={post.media[0].url}
                        alt="Post media"
                        className="h-full w-full rounded-xl object-cover"
                      />
                    </div>
                    <div className="flex w-full flex-col gap-2">
                      {post.media.slice(1, 4).map((media, mediaIndex) => (
                        <div key={media.id} className="relative h-full w-full">
                          <Image
                            fill
                            src={media.url}
                            alt="Post media"
                            className="h-full w-full rounded-xl object-cover"
                          />
                          {mediaIndex === 2 && post.media.length > 4 && (
                            <div className="absolute bottom-2 right-2 rounded-full bg-black/50 px-2 py-1 text-white">
                              +{post.media.length - 4}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            <div className="flex items-center justify-between pt-4">
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
              >
                <Heart className="h-4 w-4" />
                <span className="text-xs">{post.likes?.length || 0}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

const ProjectsCard = ({ projects }: { projects: any[] }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
    {projects.map((project) => (
      <Card
        key={project.id}
        className="transition-shadow duration-300 hover:shadow-md"
      >
        <CardHeader>
          <CardTitle>{project.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{project.description}</p>
          {project.image && (
            <Image
              src={project.image}
              alt={project.name}
              width={500}
              height={300}
              className="mt-4 rounded-md object-cover"
            />
          )}
        </CardContent>
      </Card>
    ))}
  </div>
);

export default ExploreEntry;
