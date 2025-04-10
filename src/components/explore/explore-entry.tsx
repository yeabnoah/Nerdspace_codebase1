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
import {
  Loader2,
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Calendar,
  ArrowRight,
  Users,
  MessageSquare,
} from "lucide-react";
import PostCard from "@/components/post/PostCard";
import { useInView } from "react-intersection-observer";
import { useDebounce } from "@/hooks/use-debounce";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import ProjectExploreCard from "./project-explore-card";
import ExplorePostCard from "./explore-post-card";
import { useRouter } from "next/navigation";
import useSearchStore from "@/store/search.store";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const ITEMS_PER_PAGE = 10;

const ExploreEntry = () => {
  const { query, setQuery } = useSearchStore();
  const [type, setType] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
  const [activeTab, setActiveTab] = useState("users");
  const [filters, setFilters] = useState({
    user: [],
    post: [],
    project: [],
    community: [],
  });
  const [showFilters, setShowFilters] = useState(false);
  const debouncedQuery = useDebounce(query, 500);
  const { ref, inView } = useInView();
  const router = useRouter();

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

  const handleTabChange = (value: string) => {
    setActiveTab(value);
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

  const handleTypeChange = (value: string) => {
    setType(value);
  };

  const filteredResults = useMemo(() => {
    if (!data?.pages) return null;
    const allResults = data.pages.reduce((acc, page) => ({
      users: [...(acc.users || []), ...(page.users || [])],
      posts: [...(acc.posts || []), ...(page.posts || [])],
      projects: [...(acc.projects || []), ...(page.projects || [])],
      communities: [...(acc.communities || []), ...(page.communities || [])],
    }));

    if (type === "all") {
      return allResults;
    }

    return {
      users: type === "user" ? allResults.users : [],
      posts: type === "post" ? allResults.posts : [],
      projects: type === "project" ? allResults.projects : [],
      communities: type === "community" ? allResults.communities : [],
    };
  }, [data, type]);

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
            {/* <SelectItem value="popular">Most Popular</SelectItem> */}
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
              <SheetTitle className="font-instrument">
                Search Filters
              </SheetTitle>
            </SheetHeader>
            <div className="mt-4 space-y-4">
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
            <div className="flex h-full w-full items-center justify-center font-instrument text-xl">
              Will add filtering features soon ..
            </div>
          </SheetContent>
        </Sheet>
      </motion.div>
    ),
    [showFilters, type],
  );

  return (
    <div className="relative mx-auto max-w-7xl p-4 sm:p-6">
      {/* Glow effects */}
      <div className="absolute -right-10 -top-20 h-[300px] w-[300px] -rotate-45 rounded-full bg-gradient-to-br from-amber-300/10 to-transparent blur-[80px] dark:from-orange-300/10"></div>
      <div className="absolute -bottom-20 -left-10 h-[300px] w-[300px] rotate-45 rounded-full bg-gradient-to-tl from-blue-300/10 to-transparent blur-[80px] dark:from-indigo-300/10"></div>

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="font-geist mb-3 text-start text-3xl font-medium text-primary  "
      >
        Explore
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col gap-4 rounded-xl bg-card/40 p-4 shadow-sm backdrop-blur-sm supports-[backdrop-filter]:bg-card/60 sm:mb-12 sm:flex-row sm:items-center sm:p-6"
      >
        <div className="flex-1">{searchInput}</div>
        <div className="flex gap-2">
          <Select value={type} onValueChange={handleTypeChange}>
            <SelectTrigger className="h-12 w-40 rounded-xl border-none bg-card/40 shadow-sm backdrop-blur-sm transition-all duration-300 focus:ring-2 focus:ring-primary/20 sm:h-14">
              <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-none bg-card/80 shadow-lg backdrop-blur-sm">
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="user">Users</SelectItem>
              <SelectItem value="post">Posts</SelectItem>
              <SelectItem value="project">Projects</SelectItem>
              <SelectItem value="community">Communities</SelectItem>
            </SelectContent>
          </Select>
          {sortSelect}
          {filterButton}
        </div>
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
      {isFetching && !filteredResults && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center py-8"
        >
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </motion.div>
      )}

      {filteredResults && (
        <div className="space-y-8">
          {type === "all" && (
            <>
              {/* Users Section */}
              {filteredResults.users?.length > 0 && (
                <div>
                  <h2 className="mb-4 text-xl font-semibold">Users</h2>
                  <UsersCard users={filteredResults.users} />
                </div>
              )}

              {/* Posts Section */}
              {filteredResults.posts?.length > 0 && (
                <div>
                  <h2 className="mb-4 text-xl font-semibold">Posts</h2>
                  <PostsCard posts={filteredResults.posts} />
                </div>
              )}

              {/* Projects Section */}
              {filteredResults.projects?.length > 0 && (
                <div>
                  <h2 className="mb-4 text-xl font-semibold">Projects</h2>
                  <ProjectsCard projects={filteredResults.projects} />
                </div>
              )}

              {/* Communities Section */}
              {filteredResults.communities?.length > 0 && (
                <div>
                  <h2 className="mb-4 text-xl font-semibold">Communities</h2>
                  <CommunitiesCard communities={filteredResults.communities} />
                </div>
              )}
            </>
          )}

          {type !== "all" && (
            <div>
              {type === "user" && filteredResults.users?.length > 0 && (
                <UsersCard users={filteredResults.users} />
              )}
              {type === "post" && filteredResults.posts?.length > 0 && (
                <PostsCard posts={filteredResults.posts} />
              )}
              {type === "project" && filteredResults.projects?.length > 0 && (
                <ProjectsCard projects={filteredResults.projects} />
              )}
              {type === "community" &&
                filteredResults.communities?.length > 0 && (
                  <CommunitiesCard communities={filteredResults.communities} />
                )}
              {!filteredResults[`${type}s`]?.length && (
                <p className="text-center text-muted-foreground">
                  No {type}s found
                </p>
              )}
            </div>
          )}
        </div>
      )}

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

const UsersCard = ({ users }: { users: any[] }) => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {users.map((user) => (
        <div
          key={user.id}
          className="group relative overflow-hidden rounded-2xl border-none bg-gradient-to-br from-zinc-100 via-white to-zinc-50 shadow-md transition-all duration-300 hover:scale-[1.02] dark:from-zinc-900 dark:via-zinc-800/10 dark:to-black"
        >
          {/* Content container */}
          <div className="relative z-10 flex flex-col p-6">
            {/* Avatar and basic info */}
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16 ring-2 ring-white dark:ring-zinc-800">
                <AvatarImage src={user.image || "/user.jpg"} alt={user.name} />
                <AvatarFallback>
                  {user.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-heading text-lg font-semibold text-zinc-900 dark:text-white">
                  {user.name}
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  @{user.nerdAt}
                </p>
              </div>
            </div>

            {/* Bio section */}
            {user.bio && (
              <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-zinc-600 dark:text-white/80">
                {user.bio}
              </p>
            )}

            {/* Stats section */}
            <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl bg-zinc-100/50 p-4 dark:bg-zinc-800/20">
              <div className="flex flex-col items-center gap-1">
                <span className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {user._count?.followers || 0}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  Followers
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-lg font-semibold text-zinc-900 dark:text-white">
                  {user._count?.posts || 0}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">
                  Posts
                </span>
              </div>
            </div>

            {/* Action button */}
            <Button
              className="mt-6 w-full gap-2 bg-transparent text-black shadow-none transition-all hover:bg-transparent dark:text-white"
              onClick={() => router.push(`/user-profile/${user.id}`)}
            >
              View Profile
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

const PostsCard = ({ posts }: { posts: any[] }) => {
  const router = useRouter();
  const [expandedStates, setExpandedStates] = useState<boolean[]>([]);
  const [commentShown, setCommentShown] = useState<{ [key: string]: boolean }>(
    {},
  );
  const [expandedComments, setExpandedComments] = useState<{
    [key: string]: boolean;
  }>({});
  const [replyShown, setReplyShown] = useState<{ [key: string]: boolean }>({});
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>(
    {},
  );
  const [expandedReplies, setExpandedReplies] = useState<{
    [key: string]: boolean;
  }>({});
  const [modalEditOpened, setModalEditOpened] = useState(false);
  const [modalDeleteOpened, setModalDeleteOpened] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [commentId, setCommentId] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [hasNextCommentPage, setHasNextCommentPage] = useState(false);
  const [isFetchingNextCommentPage, setIsFetchingNextCommentPage] =
    useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);

  const handlePostClick = (post: any) => {
    setSelectedPost(post);
    router.push(`/post/${post.id}`);
  };

  const toggleExpand = (index: number) => {
    setExpandedStates((prev) => {
      const newStates = [...prev];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };

  const toggleCommentShown = (postId: string) => {
    setCommentShown((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const toggleCommentExpand = (commentId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const toggleReplyShown = (commentId: string) => {
    setReplyShown((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const toggleReplies = (commentId: string) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleReplySubmit = (commentId: string) => {
    // Implement reply submission logic
  };

  const handleEditComment = (commentId: string) => {
    // Implement edit comment logic
  };

  const handleDeleteComment = (commentId: string) => {
    // Implement delete comment logic
  };

  const openEditModal = (comment: any) => {
    // Implement open edit modal logic
  };

  const openDeleteModal = (comment: any) => {
    // Implement open delete modal logic
  };

  const setSelectedCommentReply = (comment: any) => {
    // Implement set selected comment reply logic
  };

  const setEditModal = (open: boolean) => {
    setModalEditOpened(open);
  };

  const setDeleteModal = (open: boolean) => {
    setModalDeleteOpened(open);
  };

  const changePostAccessType = (post: any) => {
    // Implement change post access type logic
  };

  const handleFollow = (post: any) => {
    // Implement handle follow logic
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {selectedPost && (
        <ExplorePostCard
          post={selectedPost}
          index={0}
          expandedStates={expandedStates}
          toggleExpand={toggleExpand}
          commentShown={commentShown}
          toggleCommentShown={toggleCommentShown}
          expandedComments={expandedComments}
          toggleCommentExpand={toggleCommentExpand}
          replyShown={replyShown}
          toggleReplyShown={toggleReplyShown}
          replyContent={replyContent}
          setReplyContent={setReplyContent}
          handleReplySubmit={handleReplySubmit}
          expandedReplies={expandedReplies}
          toggleReplies={toggleReplies}
          handleEditComment={handleEditComment}
          handleDeleteComment={handleDeleteComment}
          openEditModal={openEditModal}
          openDeleteModal={openDeleteModal}
          setSelectedCommentReply={setSelectedCommentReply}
          modalEditOpened={modalEditOpened}
          modalDeleteOpened={modalDeleteOpened}
          reportModalOpen={reportModalOpen}
          setReportModalOpen={setReportModalOpen}
          setCommentId={setCommentId}
          commentLoading={commentLoading}
          comments={comments}
          hasNextCommentPage={hasNextCommentPage}
          isFetchingNextCommentPage={isFetchingNextCommentPage}
          fetchNextCommentPage={() => {}}
          setEditModal={setEditModal}
          setDeleteModal={setDeleteModal}
          changePostAccessType={changePostAccessType}
          handleFollow={handleFollow}
        />
      )}
      {posts.map((post, index) => (
        <div
          key={post.id}
          onClick={() => handlePostClick(post)}
          className="cursor-pointer"
        >
          <ExplorePostCard
            post={post}
            index={index + 1}
            expandedStates={expandedStates}
            toggleExpand={toggleExpand}
            commentShown={commentShown}
            toggleCommentShown={toggleCommentShown}
            expandedComments={expandedComments}
            toggleCommentExpand={toggleCommentExpand}
            replyShown={replyShown}
            toggleReplyShown={toggleReplyShown}
            replyContent={replyContent}
            setReplyContent={setReplyContent}
            handleReplySubmit={handleReplySubmit}
            expandedReplies={expandedReplies}
            toggleReplies={toggleReplies}
            handleEditComment={handleEditComment}
            handleDeleteComment={handleDeleteComment}
            openEditModal={openEditModal}
            openDeleteModal={openDeleteModal}
            setSelectedCommentReply={setSelectedCommentReply}
            modalEditOpened={modalEditOpened}
            modalDeleteOpened={modalDeleteOpened}
            reportModalOpen={reportModalOpen}
            setReportModalOpen={setReportModalOpen}
            setCommentId={setCommentId}
            commentLoading={commentLoading}
            comments={comments}
            hasNextCommentPage={hasNextCommentPage}
            isFetchingNextCommentPage={isFetchingNextCommentPage}
            fetchNextCommentPage={() => {}}
            setEditModal={setEditModal}
            setDeleteModal={setDeleteModal}
            changePostAccessType={changePostAccessType}
            handleFollow={handleFollow}
          />
        </div>
      ))}
    </div>
  );
};

const ProjectsCard = ({ projects }: { projects: any[] }) => {
  const router = useRouter();

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <div
          key={project.id}
          onClick={() => router.push(`/project/${project.id}`)}
          className="group relative h-[380px] w-full max-w-sm cursor-pointer overflow-hidden rounded-2xl border-none bg-gradient-to-br from-zinc-100 via-white to-zinc-50 shadow-md transition-all duration-300 hover:scale-[1.02] dark:from-zinc-900 dark:via-zinc-800/10 dark:to-black"
        >
          {/* Subtle animated glow effect */}
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-violet-500/5 via-transparent to-emerald-500/5 opacity-0 blur-xl transition-opacity duration-700 group-hover:opacity-100 dark:from-violet-500/10 dark:to-emerald-500/10"></div>

          {/* Background image with improved overlay */}
          <div className="absolute inset-0 z-0">
            <Image
              src={project.image || "/placeholder.svg?height=400&width=600"}
              alt={project.name}
              fill
              className="object-cover opacity-40 transition-all duration-700 group-hover:scale-105 group-hover:opacity-50 dark:opacity-40 dark:group-hover:opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-white/40 dark:from-black dark:via-black/80 dark:to-transparent"></div>
          </div>

          {/* Content container with better spacing */}
          <div className="relative z-10 flex h-full flex-col p-6">
            {/* Top section with date badge */}
            <div className="mb-auto flex w-full items-start justify-between">
              {/* Modern date badge */}
              <div className="overflow-hidden rounded-xl bg-zinc-800/10 backdrop-blur-md dark:bg-white/10">
                <div className="bg-zinc-800 px-3 py-1 text-center text-[10px] font-semibold text-white dark:bg-black/60">
                  {new Date(project.createdAt)
                    .toLocaleString("default", { month: "short" })
                    .toUpperCase()}
                </div>
                <div className="px-3 py-1.5 text-center">
                  <div className="text-lg font-bold text-zinc-800 dark:text-white">
                    {new Date(project.createdAt).getDate()}
                  </div>
                </div>
              </div>
            </div>

            {/* Project details with improved typography */}
            <div className="mt-auto space-y-4">
              {/* Status badge */}
              <Badge
                variant="outline"
                className="border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
              >
                Active
              </Badge>

              {/* Title with better typography */}
              <h2 className="font-heading font-instrument text-2xl font-bold leading-tight text-zinc-900 dark:text-white">
                {project.name}
              </h2>

              {/* Timestamp with icon */}
              <div className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-white/60">
                <Calendar className="h-3 w-3" />
                <span>
                  {formatDistanceToNow(new Date(project.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>

              {/* Description with better readability */}
              <p className="line-clamp-2 text-xs leading-relaxed text-zinc-600 dark:text-white/80">
                {project.description}
              </p>

              {/* Action button with hover effect */}
              <Button className="mt-4 w-full gap-2 bg-transparent text-black shadow-none transition-all hover:bg-transparent dark:text-white">
                View Project
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Subtle border glow on hover */}
          <div className="absolute inset-0 rounded-2xl border border-zinc-200 transition-all duration-300 group-hover:border-zinc-300 dark:border-white/5 dark:group-hover:border-white/10"></div>
        </div>
      ))}
    </div>
  );
};

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
