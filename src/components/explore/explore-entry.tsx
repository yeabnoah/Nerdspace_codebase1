"use client";
import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Loader2, Search, Filter, SortAsc, SortDesc } from "lucide-react";
import PostCard from "@/components/post/PostCard";
import { useInView } from "react-intersection-observer";
import { useDebounce } from "@/hooks/use-debounce";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const ITEMS_PER_PAGE = 10;

const ExploreEntry = () => {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
  const [filters, setFilters] = useState({
    user: [],
    post: [],
    project: [],
    community: []
  });
  const [showFilters, setShowFilters] = useState(false);
  const debouncedQuery = useDebounce(query, 500);
  const { ref, inView } = useInView();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["explore", debouncedQuery, type, sortBy, filters],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axios.get(
        `/api/explore?q=${debouncedQuery}&type=${type}&page=${pageParam}&sort=${sortBy}&filters=${encodeURIComponent(JSON.stringify(filters))}`,
      );
      return response.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      const totalItems = allPages.length * ITEMS_PER_PAGE;
      const hasMore =
        lastPage.users?.length === ITEMS_PER_PAGE ||
        lastPage.posts?.length === ITEMS_PER_PAGE ||
        lastPage.projects?.length === ITEMS_PER_PAGE ||
        lastPage.communities?.length === ITEMS_PER_PAGE;
      return hasMore ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!debouncedQuery.trim(),
  });

  React.useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleTypeChange = (value: string) => {
    setType(value);
  };

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  const searchInput = useMemo(
    () => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative flex-1"
      >
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground sm:h-5 sm:w-5" />
        <Input
          placeholder="Search anything..."
          value={query}
          onChange={handleQueryChange}
          className="h-12 w-full rounded-xl border-none bg-card/40 pl-10 pr-4 text-base shadow-sm backdrop-blur-sm transition-all duration-300 focus:bg-card/60 focus:ring-2 focus:ring-primary/20 sm:h-14 sm:pl-12 sm:text-lg"
        />
      </motion.div>
    ),
    [query],
  );

  const typeSelect = useMemo(
    () => (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="w-full sm:w-40"
      >
        <Select value={type} onValueChange={handleTypeChange}>
          <SelectTrigger className="h-12 w-full rounded-xl border-none bg-card/40 shadow-sm backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:ring-primary/20 sm:h-14">
            <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-none bg-card/80 shadow-lg backdrop-blur-sm">
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="user">Users</SelectItem>
            <SelectItem value="post">Posts</SelectItem>
            <SelectItem value="project">Projects</SelectItem>
            <SelectItem value="community">Communities</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>
    ),
    [type],
  );

  const sortSelect = useMemo(
    () => (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full sm:w-40"
      >
        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="h-12 w-full rounded-xl border-none bg-card/40 shadow-sm backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:ring-primary/20 sm:h-14">
            <SortAsc className="mr-2 h-4 w-4 text-muted-foreground" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="rounded-xl border-none bg-card/80 shadow-lg backdrop-blur-sm">
            <SelectItem value="relevance">Relevance</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>
    ),
    [sortBy],
  );

  const filterButton = useMemo(
    () => (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Sheet open={showFilters} onOpenChange={setShowFilters}>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              className="h-12 rounded-xl border-none bg-card/40 shadow-sm backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:ring-primary/20 sm:h-14"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent className="w-[400px]">
            <SheetHeader>
              <SheetTitle>Search Filters</SheetTitle>
            </SheetHeader>
            <div className="mt-4 space-y-4">
              {/* Add filter options based on type */}
              {type === "user" && (
                <div className="space-y-2">
                  <Label>Followers</Label>
                  <Slider
                    defaultValue={[0, 1000]}
                    max={1000}
                    step={10}
                    className="w-full"
                  />
                </div>
              )}
              {type === "post" && (
                <div className="space-y-2">
                  <Label>Likes</Label>
                  <Slider
                    defaultValue={[0, 100]}
                    max={100}
                    step={1}
                    className="w-full"
                  />
                </div>
              )}
              {/* Add more filter options as needed */}
            </div>
          </SheetContent>
        </Sheet>
      </motion.div>
    ),
    [showFilters, type],
  );

  const allResults = useMemo(() => {
    if (!data?.pages) return null;
    return data.pages.reduce((acc, page) => ({
      users: [...(acc.users || []), ...(page.users || [])],
      posts: [...(acc.posts || []), ...(page.posts || [])],
      projects: [...(acc.projects || []), ...(page.projects || [])],
      communities: [...(acc.communities || []), ...(page.communities || [])],
    }));
  }, [data]);

  return (
    <div className="mx-auto max-w-7xl p-4 sm:p-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 text-center font-instrument text-3xl font-bold text-primary sm:mb-8 sm:text-5xl"
      >
        Explore
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col gap-4 rounded-xl bg-card/40 p-4 shadow-sm backdrop-blur-sm supports-[backdrop-filter]:bg-card/60 sm:mb-12 sm:flex-row sm:items-center sm:p-6"
      >
        {searchInput}
        {typeSelect}
        {sortSelect}
        {filterButton}
      </motion.div>
      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 text-center text-destructive"
        >
          Error: {error.message}
        </motion.p>
      )}
      {isFetching && !allResults && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center py-8"
        >
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </motion.div>
      )}
      <AnimatePresence>
        {allResults && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Tabs defaultValue="all" className="space-y-6 sm:space-y-8">
              <TabsList className="flex w-full flex-wrap justify-start gap-2 border-b bg-transparent">
                <TabsTrigger
                  value="all"
                  className="rounded-lg px-3 py-1.5 text-sm data-[state=active]:bg-primary/10 data-[state=active]:text-primary sm:px-4 sm:py-2 sm:text-base"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="users"
                  className="rounded-lg px-3 py-1.5 text-sm data-[state=active]:bg-primary/10 data-[state=active]:text-primary sm:px-4 sm:py-2 sm:text-base"
                >
                  Users
                </TabsTrigger>
                <TabsTrigger
                  value="posts"
                  className="rounded-lg px-3 py-1.5 text-sm data-[state=active]:bg-primary/10 data-[state=active]:text-primary sm:px-4 sm:py-2 sm:text-base"
                >
                  Posts
                </TabsTrigger>
                <TabsTrigger
                  value="projects"
                  className="rounded-lg px-3 py-1.5 text-sm data-[state=active]:bg-primary/10 data-[state=active]:text-primary sm:px-4 sm:py-2 sm:text-base"
                >
                  Projects
                </TabsTrigger>
                <TabsTrigger
                  value="communities"
                  className="rounded-lg px-3 py-1.5 text-sm data-[state=active]:bg-primary/10 data-[state=active]:text-primary sm:px-4 sm:py-2 sm:text-base"
                >
                  Communities
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-6 sm:space-y-8">
                {allResults.users && <UsersCard users={allResults.users} />}
                {allResults.posts && <PostsCard posts={allResults.posts} />}
                {allResults.projects && (
                  <ProjectsCard projects={allResults.projects} />
                )}
                {allResults.communities && (
                  <CommunitiesCard communities={allResults.communities} />
                )}
              </TabsContent>

              <TabsContent value="users">
                {allResults.users && <UsersCard users={allResults.users} />}
              </TabsContent>

              <TabsContent value="posts">
                {allResults.posts && <PostsCard posts={allResults.posts} />}
              </TabsContent>

              <TabsContent value="projects">
                {allResults.projects && (
                  <ProjectsCard projects={allResults.projects} />
                )}
              </TabsContent>

              <TabsContent value="communities">
                {allResults.communities && (
                  <CommunitiesCard communities={allResults.communities} />
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        )}
      </AnimatePresence>
      <div ref={ref} className="h-10">
        {isFetchingNextPage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center py-4"
          >
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </motion.div>
        )}
      </div>
    </div>
  );
};

const UsersCard = ({ users }: { users: any[] }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
    {users.map((user) => (
      <Card
        key={user.id}
        className="group border-border/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
      >
        <CardHeader className="flex flex-row items-center gap-3 p-4 sm:gap-4 sm:p-6">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/20 transition-all duration-300 group-hover:ring-primary/40 sm:h-16 sm:w-16"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 sm:h-16 sm:w-16">
              <span className="text-xl font-bold text-primary/60 sm:text-2xl">
                {user.name[0]}
              </span>
            </div>
          )}
          <div>
            <CardTitle className="text-base font-semibold sm:text-lg">
              {user.name}
            </CardTitle>
            <p className="text-xs text-muted-foreground sm:text-sm">
              @{user.nerdAt}
            </p>
          </div>
        </CardHeader>
      </Card>
    ))}
  </div>
);

const PostsCard = ({ posts }: { posts: any[] }) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
};

const ProjectsCard = ({ projects }: { projects: any[] }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
    {projects.map((project) => (
      <Card
        key={project.id}
        className="group border-border/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
      >
        <CardHeader className="space-y-2 p-4 sm:p-6">
          <CardTitle className="text-lg font-semibold sm:text-xl">
            {project.name}
          </CardTitle>
          <p className="line-clamp-2 text-xs text-muted-foreground sm:text-sm">
            {project.description}
          </p>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          {project.image && (
            <div className="relative aspect-video overflow-hidden rounded-lg">
              <Image
                src={project.image}
                alt={project.name}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          )}
        </CardContent>
      </Card>
    ))}
  </div>
);

const CommunitiesCard = ({ communities }: { communities: any[] }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
    {communities.map((community) => (
      <Card
        key={community.id}
        className="group border-border/50 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
      >
        <CardHeader className="flex flex-row items-center gap-3 p-4 sm:gap-4 sm:p-6">
          {community.image ? (
            <img
              src={community.image}
              alt={community.name}
              className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/20 transition-all duration-300 group-hover:ring-primary/40 sm:h-16 sm:w-16"
            />
          ) : (
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 sm:h-16 sm:w-16">
              <span className="text-xl font-bold text-primary/60 sm:text-2xl">
                {community.name[0]}
              </span>
            </div>
          )}
          <div>
            <CardTitle className="text-base font-semibold sm:text-lg">
              {community.name}
            </CardTitle>
            <p className="text-xs text-muted-foreground sm:text-sm">
              @{community.nerdAt}
            </p>
          </div>
        </CardHeader>
      </Card>
    ))}
  </div>
);

export default ExploreEntry;
