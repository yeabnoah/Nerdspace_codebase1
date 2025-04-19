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
  const [commentShown, setCommentShown] = useState<{ [key: string]: boolean }>({});
  const [expandedComments, setExpandedComments] = useState<{ [key: string]: boolean }>({});
  const [replyShown, setReplyShown] = useState<{ [key: string]: boolean }>({});
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});
  const [expandedReplies, setExpandedReplies] = useState<{ [key: string]: boolean }>({});
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
      const response = await axios.get(`/api/posts/user/${user?.id}`);
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
      <div className="container relative mx-10 pb-8 font-geist">
        <div className="absolute -right-10 -top-20 hidden h-[300px] w-[300px] -rotate-45 rounded-full bg-gradient-to-br from-amber-300/10 to-transparent blur-[80px] dark:from-orange-300/10 md:block"></div>

        <div className="group relative mb-12 h-[400px] w-full overflow-hidden rounded-2xl shadow-lg md:h-[250px]">
          <Skeleton className="h-full w-full" />
        </div>

        <div className="relative z-10 mx-2 my-5 -mt-16 flex flex-col items-start gap-1">
          <div className="relative mx-5 -mt-16 h-28 w-28 overflow-hidden rounded-full ring-2 ring-white/20">
            <Skeleton className="h-full w-full rounded-full" />
          </div>
          <div className="flex flex-col gap-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-32" />
            <div className="flex gap-4">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="space-y-8 lg:col-span-2">
            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-500/5 dark:bg-black">
              <div className="p-8">
                <div className="mb-4">
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="mt-4">
                  <Skeleton className="h-64 w-full" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container relative mx-10 pb-8 font-geist">
      <div className="absolute -right-10 -top-20 hidden h-[300px] w-[300px] -rotate-45 rounded-full bg-gradient-to-br from-amber-300/10 to-transparent blur-[80px] dark:from-orange-300/10 md:block"></div>

      <div className="group relative mb-12 h-[400px] w-full overflow-hidden rounded-xl shadow-lg md:h-[250px]">
        <Image
          src={user.coverImage || "/obsession.jpg"}
          alt="Cover Image"
          fill
          quality={100}
          className="object-cover"
          priority={true}
        />
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-zinc-900/90 via-zinc-900/60 to-transparent p-8 dark:from-black/80 dark:via-black/50">
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-900/90 to-transparent dark:from-black"></div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="absolute right-4 top-4 rounded-full bg-black p-2">
              <SettingsIcon className="size-4 cursor-pointer rounded-full text-white" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-48 rounded-2xl border-none bg-white/80 shadow-lg backdrop-blur-sm dark:bg-black/80"
          >
            <DropdownMenuItem
              onClick={() => router.push("/settings")}
              className="h-10 cursor-pointer rounded-xl hover:bg-black/70"
            >
              <SettingsIcon className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("/settings?tab=account")}
              className="h-10 cursor-pointer rounded-xl hover:bg-black/70"
            >
              <User2 className="mr-2 h-4 w-4" />
              <span>Account</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("/settings?tab=terms")}
              className="h-10 cursor-pointer rounded-xl hover:bg-black/70"
            >
              <File className="mr-2 h-4 w-4" />
              <span>Terms & Conditions</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="relative z-10 mx-2 my-5 -mt-8 ml-5 flex flex-col items-start gap-1">
        <div className="relative h-20 w-20 -mt-16 shrink-0 overflow-hidden rounded-full ring-2 ring-white/20">
          <Image
            src={user.image || "/user.jpg?height=128&width=128"}
            alt={user.visualName || user.name}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex w-full flex-col">
          <div className="flex items-start justify-between">
            <div className="flex flex-col">
              <h1 className="font-geist text-xl font-medium text-foreground">
                {user.visualName || user.name}
              </h1>
              <div className="flex items-center gap-2">
                <p className="font-geist text-sm text-muted-foreground">
                  Nerd@{user.nerdAt}
                </p>
                {user.country && (
                  <>
                    <Dot className="h-4 w-4 text-muted-foreground" />
                    <p className="font-geist text-sm text-muted-foreground">
                      {user.country.emoji} {user.country.name}
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="flex flex-col items-start gap-2">
              {user.link && (
                <div className="flex items-center gap-2">
                  <LinkIcon className="h-4 w-4 text-muted-foreground" />
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
              <p className="font-geist text-sm text-muted-foreground">
                {user.bio || "No bio"}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href={`/profile/${user.id}/followers`}
                className="flex items-center gap-2 rounded-full border border-gray-100 bg-white px-5 py-2.5 shadow-sm hover:bg-gray-50 dark:border-gray-500/10 dark:bg-black dark:hover:bg-gray-900"
              >
                <Users className="h-4 w-4" />
                <span className="font-geist text-sm font-medium">
                  {user._count?.following || 0} Followers
                </span>
              </Link>
              <Link
                href={`/profile/${user.id}/following`}
                className="flex items-center gap-2 rounded-full border border-gray-100 bg-white px-5 py-2.5 shadow-sm hover:bg-gray-50 dark:border-gray-500/10 dark:bg-black dark:hover:bg-gray-900"
              >
                <Users className="h-4 w-4" />
                <span className="font-geist text-sm font-medium">
                  {user._count?.followers || 0} Following
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="">
        <div className="space-y-8 lg:col-span-2">
          <Card className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm dark:border-gray-500/5 dark:bg-black">
            <CardContent className="p-8">
              <Tabs
                defaultValue="posts"
                className="w-full"
                onValueChange={setActiveTab}
              >
                <TabsList className="scrollbar-hide mb-2 flex h-12 justify-start overflow-x-auto bg-transparent">
                  <TabsTrigger
                    value="posts"
                    className="h-10 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Grid3X3 className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Posts</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="projects"
                    className="h-10 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Hammer className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Projects</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="bookmarks"
                    className="h-10 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Bookmark className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Bookmarks</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="private"
                    className="h-10 rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                  >
                    <Lock className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Private</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="posts" className="mt-0">
                  <div className="space-y-4">
                    {posts?.map((post : postInterface, index : number) => (
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
