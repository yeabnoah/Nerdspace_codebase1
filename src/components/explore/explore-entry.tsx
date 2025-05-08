"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useDebounce } from "@/hooks/use-debounce";
import type PostCommentInterface from "@/interface/auth/comment.interface";
import type postInterface from "@/interface/auth/post.interface";
import useSearchStore from "@/store/search.store";
import { useInfiniteQuery } from "@tanstack/react-query";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  Filter,
  Loader2,
  Search,
  SortAsc,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Label } from "../ui/label";
import { Slider } from "../ui/slider";
import ExplorePostCard from "./explore-post-card";

// Type definitions
interface User {
  id: string;
  name: string;
  email?: string;
  nerdAt?: string;
  image?: string;
  bio?: string;
  createdAt: Date | string;
  _count?: {
    followers: number;
    following: number;
    posts: number;
  };
}

interface Project {
  id: string;
  name: string;
  description: string;
  image?: string;
  userId: string;
  createdAt: Date | string;
  user?: User;
  status?: string;
}

interface Comment {
  id: string;
  content: string;
  postId: string;
  userId: string;
  createdAt: Date | string;
  user: User;
}

const ITEMS_PER_PAGE = 10;

const NoResultsFound = ({ type }: { type: string }) => (
  <div className="flex flex-col justify-center items-center py-12 text-center">
    <Search className="w-12 h-12 text-muted-foreground" />
    <h3 className="mt-4 font-semibold text-lg">No {type} found</h3>
    <p className="mt-2 text-muted-foreground text-sm">
      Try adjusting your search or filters to find what you&apos;re looking for
    </p>
  </div>
);

const ExploreEntry = () => {
  const { query, setQuery } = useSearchStore();
  const [type, setType] = useState("all");
  const [sortBy, setSortBy] = useState("relevance");
  const [filters] = useState({
    user: [],
    post: [],
    project: [],
    community: [],
  });
  const [showFilters, setShowFilters] = useState(false);
  const debouncedQuery = useDebounce(query, 500);
  const { ref, inView } = useInView();
  // const router = useRouter();

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["explore", debouncedQuery, type, sortBy, filters],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await axios.get(
        `/api/explore?q=${debouncedQuery}&type=${type}&page=${pageParam}&sort=${sortBy}&filters=${encodeURIComponent(JSON.stringify(filters))}`,
      );
      return response.data;
    },
    getNextPageParam: (lastPage, allPages) => {
      const hasMore =
        lastPage.users?.length === ITEMS_PER_PAGE ||
        lastPage.posts?.length === ITEMS_PER_PAGE ||
        lastPage.projects?.length === ITEMS_PER_PAGE;
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
        <Search className="top-1/2 left-3 sm:left-4 absolute w-4 sm:w-5 h-4 sm:h-5 text-muted-foreground -translate-y-1/2" />
        <Input
          placeholder="Search anything..."
          value={query}
          onChange={handleQueryChange}
          className="bg-card/40 focus:bg-card/60 shadow-sm backdrop-blur-sm pr-4 pl-9 sm:pl-12 border-none rounded-xl focus:ring-2 focus:ring-primary/20 w-full h-11 sm:h-12 text-sm sm:text-base transition-all duration-300"
        />
      </motion.div>
    ),
    [query, handleQueryChange],
  );

  const filteredResults = useMemo(() => {
    if (!data?.pages) return null;
    const allResults = data.pages.reduce((acc, page) => ({
      users: [...(acc.users || []), ...(page.users || [])],
      posts: [...(acc.posts || []), ...(page.posts || [])],
      projects: [...(acc.projects || []), ...(page.projects || [])],
    }));

    if (type === "all") {
      return allResults;
    }

    return {
      users: type === "user" ? allResults.users : [],
      posts: type === "post" ? allResults.posts : [],
      projects: type === "project" ? allResults.projects : [],
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
          <SelectTrigger className="bg-card/40 shadow-sm backdrop-blur-sm border-none rounded-xl focus:ring-2 focus:ring-primary/20 w-full h-11 sm:h-12 transition-all duration-300">
            <SortAsc className="mr-2 w-4 h-4 text-muted-foreground" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent className="bg-card/80 shadow-lg backdrop-blur-sm border-none rounded-xl">
            <SelectItem value="relevance">Relevance</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
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
              className="bg-card/40 shadow-sm backdrop-blur-sm border-none rounded-xl focus:ring-2 focus:ring-primary/20 w-full sm:w-auto h-11 sm:h-12 transition-all duration-300"
            >
              <Filter className="mr-2 w-4 h-4" />
              Filters
            </Button>
          </SheetTrigger>
          <SheetContent className="w-full sm:w-[400px] max-w-[400px]">
            <SheetHeader>
              <SheetTitle className="font-instrument">Search Filters</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 mt-4">
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
                    defaultValue={[0, 1000]}
                    max={1000}
                    step={10}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </motion.div>
    ),
    [showFilters, type],
  );

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex sm:flex-row flex-col gap-4">
        {searchInput}
        <div className="flex gap-2 sm:gap-4">
          {sortSelect}
          {filterButton}
        </div>
              </div>

      {!debouncedQuery.trim() ? (
        <div className="flex flex-col justify-center items-center py-12 text-center">
          <Search className="w-12 h-12 text-muted-foreground" />
          <h3 className="mt-4 font-semibold text-lg">Start exploring</h3>
          <p className="mt-2 text-muted-foreground text-sm">
            Search for users, posts, or projects to get started
          </p>
                </div>
      ) : isFetching ? (
        <div className="flex flex-col justify-center items-center py-12">
          <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
          <p className="mt-4 text-muted-foreground text-sm">Searching...</p>
              </div>
      ) : error ? (
        <div className="flex flex-col justify-center items-center py-12 text-center">
          <h3 className="font-semibold text-destructive text-lg">Error</h3>
          <p className="mt-2 text-muted-foreground text-sm">
            Something went wrong. Please try again.
          </p>
                </div>
      ) : filteredResults ? (
        <div className="flex flex-col gap-8">
          {type === "all" || type === "user" ? (
            filteredResults.users.length > 0 ? (
                <UsersCard users={filteredResults.users} />
            ) : type === "user" ? (
              <NoResultsFound type="users" />
            ) : null
          ) : null}

          {type === "all" || type === "post" ? (
            filteredResults.posts.length > 0 ? (
                <PostsCard posts={filteredResults.posts} />
            ) : type === "post" ? (
              <NoResultsFound type="posts" />
            ) : null
          ) : null}

          {type === "all" || type === "project" ? (
            filteredResults.projects.length > 0 ? (
                <ProjectsCard projects={filteredResults.projects} />
            ) : type === "project" ? (
              <NoResultsFound type="projects" />
            ) : null
          ) : null}

          {hasNextPage && (
            <div
              ref={ref}
              className="flex justify-center py-4"
            >
              {isFetchingNextPage ? (
                <Loader2 className="w-6 h-6 text-muted-foreground animate-spin" />
              ) : null}
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

const UsersCard = ({ users }: { users: User[] }) => {
  const router = useRouter();

  return (
    <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {users.map((user) => (
        <div
          key={user.id}
          className="group relative bg-gradient-to-br from-zinc-100 dark:from-zinc-900 via-white dark:via-zinc-800/10 to-zinc-50 dark:to-black shadow-md border-none rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300"
        >
          {/* Content container */}
          <div className="z-10 relative flex flex-col p-6">
            {/* Avatar and basic info */}
            <div className="flex items-center gap-4">
              <Avatar className="ring-2 ring-white dark:ring-zinc-800 w-16 h-16">
                <AvatarImage src={user.image || "/user.jpg"} alt={user.name} />
                <AvatarFallback>
                  {user.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-heading font-semibold text-zinc-900 dark:text-white text-lg">
                  {user.name}
                </h3>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm">
                  @{user.nerdAt}
                </p>
              </div>
            </div>

            {/* Bio section */}
            {user.bio && (
              <p className="mt-4 text-zinc-600 dark:text-white/80 text-sm line-clamp-2 leading-relaxed">
                {user.bio}
              </p>
            )}

            {/* Stats section */}
            <div className="gap-4 grid grid-cols-2 bg-zinc-100/50 dark:bg-zinc-800/20 mt-6 p-4 rounded-xl">
              <div className="flex flex-col items-center gap-1">
                <span className="font-semibold text-zinc-900 dark:text-white text-lg">
                  {user._count?.followers || 0}
                </span>
                <span className="text-zinc-500 dark:text-zinc-400 text-xs">
                  Followers
                </span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="font-semibold text-zinc-900 dark:text-white text-lg">
                  {user._count?.posts || 0}
                </span>
                <span className="text-zinc-500 dark:text-zinc-400 text-xs">
                  Posts
                </span>
              </div>
            </div>

            {/* Action button */}
            <Button
              className="gap-2 bg-transparent hover:bg-transparent shadow-none mt-6 w-full text-black dark:text-white transition-all"
              onClick={() => router.push(`/user-profile/${user.id}`)}
            >
              View Profile
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

const PostsCard = ({ posts }: { posts: postInterface[] }) => {
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
  const [selectedCommentId, setSelectedCommentId] = useState("");
  const [commentLoading] = useState(false);
  const [comments] = useState<PostCommentInterface[]>([]);
  const [hasNextCommentPage] = useState(false);
  const [isFetchingNextCommentPage] = useState(false);
  const [selectedPost, setSelectedPost] = useState<postInterface | null>(null);

  const handlePostClick = (post: postInterface) => {
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

  // These functions are stubs that would be implemented later
  const handleReplySubmit = () => {
    // Implement reply submission logic
  };

  const handleEditComment = () => {
    // Implement edit comment logic
  };

  const handleDeleteComment = () => {
    // Implement delete comment logic
  };

  const openEditModal = () => {
    // Implement open edit modal logic
  };

  const openDeleteModal = () => {
    // Implement open delete modal logic
  };

  const setSelectedCommentReply = () => {
    // Implement set selected comment reply logic
  };

  const setEditModal = (open: boolean) => {
    setModalEditOpened(open);
  };

  const setDeleteModal = (open: boolean) => {
    setModalDeleteOpened(open);
  };

  const changePostAccessType = () => {
    // Implement change post access type logic
  };

  const handleFollow = () => {
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
          setCommentId={setSelectedCommentId}
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
            setCommentId={setSelectedCommentId}
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

const ProjectsCard = ({ projects }: { projects: Project[] }) => {
  const router = useRouter();

  return (
    <div className="gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <div
          key={project.id}
          onClick={() => router.push(`/project/${project.id}`)}
          className="group relative bg-gradient-to-br from-zinc-100 dark:from-zinc-900 via-white dark:via-zinc-800/10 to-zinc-50 dark:to-black shadow-md border-none rounded-2xl w-full max-w-sm h-[380px] overflow-hidden hover:scale-[1.02] transition-all duration-300 cursor-pointer"
        >
          {/* Subtle animated glow effect */}
          <div className="z-0 absolute inset-0 bg-gradient-to-br from-violet-500/5 dark:from-violet-500/10 via-transparent to-emerald-500/5 dark:to-emerald-500/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-700"></div>

          {/* Background image with improved overlay */}
          <div className="z-0 absolute inset-0">
            <Image
              src={project.image || "/placeholder.svg?height=400&width=600"}
              alt={project.name}
              fill
              className="opacity-40 dark:group-hover:opacity-50 dark:opacity-40 group-hover:opacity-50 object-cover group-hover:scale-105 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-black via-white/80 dark:via-black/80 to-white/40 dark:to-transparent"></div>
          </div>

          {/* Content container with better spacing */}
          <div className="z-10 relative flex flex-col p-6 h-full">
            {/* Top section with date badge */}
            <div className="flex justify-between items-start mb-auto w-full">
              {/* Modern date badge */}
              <div className="bg-zinc-800/10 dark:bg-white/10 backdrop-blur-md rounded-xl overflow-hidden">
                <div className="bg-zinc-800 dark:bg-black/60 px-3 py-1 font-semibold text-[10px] text-white text-center">
                  {new Date(project.createdAt)
                    .toLocaleString("default", { month: "short" })
                    .toUpperCase()}
                </div>
                <div className="px-3 py-1.5 text-center">
                  <div className="font-bold text-zinc-800 dark:text-white text-lg">
                    {new Date(project.createdAt).getDate()}
                  </div>
                </div>
              </div>
            </div>

            {/* Project details with improved typography */}
            <div className="space-y-4 mt-auto">
              {/* Status badge */}
              <Badge
                variant="outline"
                className="bg-emerald-500/10 border-emerald-500/50 text-emerald-700 dark:text-emerald-400"
              >
                Active
              </Badge>

              {/* Title with better typography */}
              <h2 className="font-heading font-instrument font-bold text-zinc-900 dark:text-white text-2xl leading-tight">
                {project.name}
              </h2>

              {/* Timestamp with icon */}
              <div className="flex items-center gap-1.5 text-zinc-500 dark:text-white/60 text-xs">
                <Calendar className="w-3 h-3" />
                <span>
                  {formatDistanceToNow(new Date(project.createdAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>

              {/* Description with better readability */}
              <p className="text-zinc-600 dark:text-white/80 text-xs line-clamp-2 leading-relaxed">
                {project.description}
              </p>

              {/* Action button with hover effect */}
              <Button className="gap-2 bg-transparent hover:bg-transparent shadow-none mt-4 w-full text-black dark:text-white transition-all">
                View Project
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Subtle border glow on hover */}
          <div className="absolute inset-0 border border-zinc-200 dark:border-white/5 dark:group-hover:border-white/10 group-hover:border-zinc-300 rounded-2xl transition-all duration-300"></div>
        </div>
      ))}
    </div>
  );
};

// const CommunitiesCard = ({ communities }: { communities: any[] }) => (
//   <div className="gap-4 sm:gap-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//     {communities.map((community) => (
//       <Card
//         key={community.id}
//         className="group hover:shadow-lg border-border/50 hover:scale-[1.02] transition-all duration-300"
//       >
//         <CardHeader className="flex flex-row items-center gap-3 sm:gap-4 p-4 sm:p-6">
//           {community.image ? (
//             <img
//               src={community.image}
//               alt={community.name}
//               className="rounded-full ring-2 ring-primary/20 group-hover:ring-primary/40 w-12 sm:w-16 h-12 sm:h-16 object-cover transition-all duration-300"
//             />
//           ) : (
//             <div className="flex justify-center items-center bg-primary/10 rounded-full w-12 sm:w-16 h-12 sm:h-16">
//               <span className="font-bold text-primary/60 text-xl sm:text-2xl">
//                 {community.name[0]}
//               </span>
//             </div>
//           )}
//           <div>
//             <CardTitle className="font-semibold text-base sm:text-lg">
//               {community.name}
//             </CardTitle>
//             <p className="text-muted-foreground text-xs sm:text-sm">
//               @{community.nerdAt}
//             </p>
//           </div>
//         </CardHeader>
//       </Card>
//     ))}
//   </div>
// );

export default ExploreEntry;
