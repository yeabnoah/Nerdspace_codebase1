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
            {/* <SelectItem value="community">Communities</SelectItem> */}
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
            {/* <TabsTrigger value="communities">Communities</TabsTrigger> */}
          </TabsList>

          <TabsContent value="all">
            <div className="space-y-6">
              {results.users && (
                <Card>
                  <CardHeader>
                    <CardTitle>Users</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {results.users.map((user: any) => (
                      <div
                        key={user.id}
                        className="mb-4 flex items-center gap-4"
                      >
                        <img
                          src={user.image}
                          alt={user.name}
                          className="h-12 w-12 rounded-full"
                        />
                        <p>{user.name}</p>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
              {results.posts && (
                <Card>
                  <CardHeader>
                    <CardTitle>Posts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {results.posts.map((post: any) => (
                      <div key={post.id} className="mb-4">
                        <p>{post.content}</p>
                        <small className="text-gray-500">
                          {new Date(post.createdAt).toLocaleString()}
                        </small>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
              {results.projects && (
                <Card>
                  <CardHeader>
                    <CardTitle>Projects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {results.projects.map((project: any) => (
                      <div key={project.id} className="mb-4">
                        <p className="font-bold">{project.name}</p>
                        <p>{project.description}</p>
                        <img
                          src={project.image}
                          alt={project.name}
                          className="mt-2 h-20 w-20"
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
              {results.communities && (
                <Card>
                  <CardHeader>
                    <CardTitle>Communities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {results.communities.map((community: any) => (
                      <div key={community.id} className="mb-4">
                        <p className="font-bold">{community.name}</p>
                        <p>{community.description}</p>
                        <img
                          src={community.image}
                          alt={community.name}
                          className="mt-2 h-20 w-20"
                        />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="users">
            {results.users && (
              <Card>
                <CardHeader>
                  <CardTitle>Users</CardTitle>
                </CardHeader>
                <CardContent>
                  {results.users.map((user: any) => (
                    <div key={user.id} className="mb-4 flex items-center gap-4">
                      <img
                        src={user.image}
                        alt={user.name}
                        className="h-12 w-12 rounded-full"
                      />
                      <p>{user.name}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="posts">
            {results.posts && (
              <Card>
                <CardHeader>
                  <CardTitle>Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  {results.posts.map((post: any) => (
                    <div key={post.id} className="mb-4">
                      <p>{post.content}</p>
                      <small className="text-gray-500">
                        {new Date(post.createdAt).toLocaleString()}
                      </small>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="projects">
            {results.projects && (
              <Card>
                <CardHeader>
                  <CardTitle>Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  {results.projects.map((project: any) => (
                    <div key={project.id} className="mb-4">
                      <p className="font-bold">{project.name}</p>
                      <p>{project.description}</p>
                      <img
                        src={project.image}
                        alt={project.name}
                        className="mt-2 h-20 w-20"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* <TabsContent value="communities">
            {results.communities && (
              <Card>
                <CardHeader>
                  <CardTitle>Communities</CardTitle>
                </CardHeader>
                <CardContent>
                  {results.communities.map((community: any) => (
                    <div key={community.id} className="mb-4">
                      <p className="font-bold">{community.name}</p>
                      <p>{community.description}</p>
                      <img
                        src={community.image}
                        alt={community.name}
                        className="mt-2 h-20 w-20"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent> */}
        </Tabs>
      )}
    </div>
  );
};

export default ExploreEntry;
