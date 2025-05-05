"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useUserStore from "@/store/user.store";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  Bookmark,
  Dot,
  File,
  Globe,
  Grid3X3,
  Hammer,
  IdCard,
  LinkIcon,
  Lock,
  SettingsIcon,
  User2,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Skeleton } from "../ui/skeleton";
import RenderMyPost from "./myposts";
import BookmarksTab from "./tabs/BookmarksTab";
import CollectionsTab from "./tabs/CollectionsTab";
import PrivateTab from "./tabs/PrivateTab";
import ProjectsTab from "./tabs/ProjectsTab";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import PostCard from "../post/post-card";
import type postInterface from "@/interface/auth/post.interface";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("posts");
  const { user, isloading, setuser, setIsLoading } = useUserStore();
  const router = useRouter();
  const queryClient = useQueryClient();
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
  const [modalEditOpened, setEditModal] = useState(false);
  const [modalDeleteOpened, setDeleteModal] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [commentId, setCommentId] = useState("");

  console.log(activeTab);

  const { isFetching, isPending } = useQuery({
    queryKey: ["fetch_who_am_i"],
    queryFn: async () => {
      const response = await axios.get("/api/whoami", {
        withCredentials: true,
      });

      setuser(response.data.data);
      setIsLoading(false);
      //console.log(test)
      return response.data;
    },
  });

  const { data: posts } = useQuery({
    queryKey: ["my-posts", user?.id],
    queryFn: async () => {
      const response = await axios.get(`/api/user/posts?userId=${user?.id}`);
      return response.data.data;
    },
    enabled: !!user?.id,
  });

  const followMutation = useMutation({
    mutationFn: async ({
      userId,
      action,
    }: {
      userId: string;
      action: "follow" | "unfollow";
    }) => {
      const response = await axios.post(
        `/api/user/follow?userId=${userId}&action=${action}`,
      );
      return response.data;
    },
    onSuccess: (data) => {
      // Invalidate all relevant queries to ensure UI consistency
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["who-to-follow"] });
      queryClient.invalidateQueries({ queryKey: ["follow-status"] });
      queryClient.invalidateQueries({ queryKey: ["user-followers"] });
      queryClient.invalidateQueries({ queryKey: ["user-following"] });
      queryClient.invalidateQueries({ queryKey: ["explore"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user-data"] });
      toast.success(data.message);
    },
    onError: () => {
      toast.error("Error occurred while following/unfollowing user");
    },
  });

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

  const handleReplySubmit = (commentId: string) => {
    // Implement reply submit logic
    console.log("Reply submitted for comment:", commentId);
  };

  const toggleReplies = (commentId: string) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  const handleEditComment = (commentId: string) => {
    // Implement edit comment logic
    console.log("Edit comment:", commentId);
  };

  const handleDeleteComment = (commentId: string) => {
    // Implement delete comment logic
    console.log("Delete comment:", commentId);
  };

  const openEditModal = (comment: any) => {
    setEditModal(true);
  };

  const openDeleteModal = (comment: any) => {
    setDeleteModal(true);
  };

  const setSelectedCommentReply = (comment: any) => {
    // Implement selected comment reply logic
  };

  const changePostAccessType = (post: any) => {
    // Implement change post access type logic
  };

  const handleLike = (postId: string) => {
    // Implement like logic
  };

  const handleBookmark = (postId: string) => {
    // Implement bookmark logic
  };

  if (isloading || isFetching || isPending) {
    return (
      <div className="relative md:mx-10 mt-5 pb-8 font-geist container">
        <div className="hidden md:block -top-20 md:-right-10 absolute bg-gradient-to-br from-amber-300/10 dark:from-orange-300/10 to-transparent blur-[80px] rounded-full w-[300px] h-[300px] -rotate-45" />

        <div className="group relative shadow-lg mb-12 rounded-2xl w-full h-[400px] md:h-[250px] overflow-hidden">
          <Skeleton className="w-full h-full" />
        </div>

        <div className="z-10 relative flex flex-col items-start gap-1 mx-2 my-5 -mt-16">
          <div className="relative mx-5 -mt-16 rounded-full ring-2 ring-white/20 w-28 h-28 overflow-hidden">
            <Skeleton className="rounded-full w-full h-full" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="w-48 h-6" />
            <Skeleton className="w-32 h-4" />
            <div className="flex gap-4">
              <Skeleton className="w-24 h-4" />
              <Skeleton className="w-24 h-4" />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="space-y-8 lg:col-span-2">
            <div className="bg-white dark:bg-black shadow-sm border border-gray-100 dark:border-gray-500/5 rounded-xl overflow-hidden">
              <div className="p-8">
                <div className="mb-4">
                  <Skeleton className="w-full h-10" />
                </div>
                <div className="mt-4">
                  <Skeleton className="w-full h-64" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative md:mx-10 mt-5 pb-8 font-geist container">
      <div className="hidden md:block -top-20 md:-right-10 absolute bg-gradient-to-br from-amber-300/10 dark:from-orange-300/10 to-transparent blur-[80px] rounded-full w-[300px] h-[300px] -rotate-45" />

      <div className="group relative shadow-lg mb-12 rounded-xl w-full h-[250px] md:h-[400px] overflow-hidden">
        <Image
          src={user.coverImage || "/obsession.jpg"}
          alt="Cover Image"
          fill
          quality={100}
          className="object-cover"
          priority={true}
          sizes="100vw"
        />
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-zinc-900/90 dark:from-black/80 via-zinc-900/60 dark:via-black/50 to-transparent p-8">
          <div className="right-0 bottom-0 left-0 absolute bg-gradient-to-t from-zinc-900/90 dark:from-black to-transparent h-32"></div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="top-4 right-4 absolute bg-black p-2 rounded-full">
              <SettingsIcon className="rounded-full size-4 text-white cursor-pointer" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="bg-white/80 dark:bg-black/80 shadow-lg backdrop-blur-sm border-none rounded-2xl w-48"
          >
            <DropdownMenuItem
              onClick={() => router.push("/settings")}
              className="hover:bg-black/70 rounded-xl h-10 cursor-pointer"
            >
              <SettingsIcon className="mr-2 w-4 h-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("/settings?tab=account")}
              className="hover:bg-black/70 rounded-xl h-10 cursor-pointer"
            >
              <User2 className="mr-2 w-4 h-4" />
              <span>Account</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("/settings?tab=terms")}
              className="hover:bg-black/70 rounded-xl h-10 cursor-pointer"
            >
              <File className="mr-2 w-4 h-4" />
              <span>Terms & Conditions</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="z-10 relative flex flex-col items-start gap-1 mx-2 my-5 -mt-8 ml-5">
        <div className="relative -mt-16 rounded-full ring-2 ring-white/20 w-20 h-20 overflow-hidden shrink-0">
          <Image
            src={user.image || "/user.jpg?height=128&width=128"}
            alt={user.visualName || user.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>

        <div className="flex flex-col w-full">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <h1 className="font-geist font-medium text-foreground text-xl">
                {user.visualName || user.name}
              </h1>
              <div className="flex items-center gap-2">
                <p className="font-geist text-muted-foreground text-sm">
                  Nerd@{user.nerdAt}
                </p>
                {user.country && (
                  <>
                    <Dot className="w-4 h-4 text-muted-foreground" />
                    <p className="font-geist text-muted-foreground text-sm">
                      {user.country.emoji} {user.country.name}
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col items-start gap-2">
              {user.link && (
                <div className="flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-muted-foreground" />
                  <a
                    href={user.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-geist text-purple-500 text-sm hover:underline"
                  >
                    {user.link}
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-1">
            <div className="flex items-center">
              <p className="font-geist text-muted-foreground text-sm">
                {user.bio || "No bio"}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href={`/profile/${user.id}/followers`}
                className="flex items-center gap-2 bg-white hover:bg-gray-50 dark:bg-black dark:hover:bg-gray-900 shadow-sm px-5 py-2.5 border border-gray-100 dark:border-gray-500/10 rounded-full"
              >
                <Users className="w-4 h-4" />
                <span className="font-geist font-medium text-sm">
                  {user._count?.following || 0} Followers
                </span>
              </Link>
              <Link
                href={`/profile/${user.id}/following`}
                className="flex items-center gap-2 bg-white hover:bg-gray-50 dark:bg-black dark:hover:bg-gray-900 shadow-sm px-5 py-2.5 border border-gray-100 dark:border-gray-500/10 rounded-full"
              >
                <Users className="w-4 h-4" />
                <span className="font-geist font-medium text-sm">
                  {user._count?.followers || 0} Following
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <div className="space-y-8 lg:col-span-2">
          <Card className="bg-white dark:bg-black shadow-sm border border-gray-100 dark:border-gray-500/5 rounded-xl overflow-hidden">
            <CardContent className="md:p-8 px-2 py-4">
              <Tabs
                defaultValue="posts"
                className="w-full"
                onValueChange={setActiveTab}
              >
                <TabsList className="flex justify-start bg-transparent mb-2 h-12 overflow-x-auto scrollbar-hide">
                  <TabsTrigger
                    value="posts"
                    className="data-[state=active]:bg-primary rounded-full h-10 data-[state=active]:text-primary-foreground"
                  >
                    <Grid3X3 className="mr-2 w-4 h-4" />
                    <span className="hidden data-[state=active]:inline sm:inline">
                      Posts
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="projects"
                    className="data-[state=active]:bg-primary rounded-full h-10 data-[state=active]:text-primary-foreground"
                  >
                    <Hammer className="mr-2 w-4 h-4" />
                    <span className="hidden data-[state=active]:inline sm:inline">
                      Projects
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="bookmarks"
                    className="data-[state=active]:bg-primary rounded-full h-10 data-[state=active]:text-primary-foreground"
                  >
                    <Bookmark className="mr-2 w-4 h-4" />
                    <span className="hidden data-[state=active]:inline sm:inline">
                      Bookmarks
                    </span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="private"
                    className="data-[state=active]:bg-primary rounded-full h-10 data-[state=active]:text-primary-foreground"
                  >
                    <Lock className="mr-2 w-4 h-4" />
                    <span className="hidden data-[state=active]:inline sm:inline">
                      Private
                    </span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="posts" className="mt-0">
                  <div className="space-y-4">
                    {posts?.map((post: postInterface, index: number) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        index={index}
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
                        commentLoading={false}
                        comments={[]}
                        hasNextCommentPage={false}
                        isFetchingNextCommentPage={false}
                        fetchNextCommentPage={() => {}}
                        setEditModal={setEditModal}
                        setDeleteModal={setDeleteModal}
                        changePostAccessType={changePostAccessType}
                        handleLike={handleLike}
                        handleBookmark={handleBookmark}
                        setCommentId={setCommentId}
                      />
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="projects" className="mt-0">
                  <ProjectsTab />
                </TabsContent>
                <TabsContent value="collections" className="mt-0">
                  <CollectionsTab />
                </TabsContent>
                <TabsContent value="bookmarks" className="mt-0">
                  <BookmarksTab />
                </TabsContent>
                <TabsContent value="private" className="mt-0">
                  <PrivateTab />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
