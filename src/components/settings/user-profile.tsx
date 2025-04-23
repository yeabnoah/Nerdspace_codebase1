"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSession } from "@/lib/auth-client";
import useUserProfileStore from "@/store/userProfile.store";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import { Dot, Grid3X3, Hammer, LinkIcon, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import FollowButton from "./follow-button";
import ProjectsTab from "./tabs/ProjectsTab";
import UserProjectsTab from "./tabs/UserProjectsTab";
import RenderUserPosts from "./user-posts";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import PostCard from "../post/post-card";
import type postInterface from "@/interface/auth/post.interface";
import { useRouter } from "next/navigation";
import ExplorePostCard from "../explore/explore-post-card";
import PostCommentInterface from "@/interface/auth/comment.interface";

// interface FollowCounts {
//   followers: number;
//   following: number;
// }

export default function UserProfile() {
  const [activeTab, setActiveTab] = useState("posts");
  const { userProfile } = useUserProfileStore();
  const [loading, setLoading] = useState(true);
  const session = useSession();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [expandedStates, setExpandedStates] = useState<boolean[]>([]);
  const [commentShown, setCommentShown] = useState<{ [key: string]: boolean }>({});
  const [expandedComments, setExpandedComments] = useState<{ [key: string]: boolean }>({});
  const [replyShown, setReplyShown] = useState<{ [key: string]: boolean }>({});
  const [replyContent, setReplyContent] = useState<{ [key: string]: string }>({});
  const [expandedReplies, setExpandedReplies] = useState<{ [key: string]: boolean }>({});
  const [modalEditOpened, setModalEditOpened] = useState(false);
  const [modalDeleteOpened, setModalDeleteOpened] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [commentId, setCommentId] = useState("");

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

  const openEditModal = () => {
    setModalEditOpened(true);
  };

  const openDeleteModal = () => {
    setModalDeleteOpened(true);
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
    // Implement follow logic
  };

  const handlePostClick = (post: postInterface) => {
    router.push(`/post/${post.id}`);
  };

  const { data: userData, isLoading: isLoadingUser } = useQuery({
    queryKey: ["user-data", userProfile?.id],
    queryFn: async () => {
      if (!userProfile?.id) return null;

      try {
        const response = await axios.get(`/api/users/${userProfile.id}`);
        return response.data.data;
      } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
      }
    },
    enabled: !!userProfile?.id,
  });

  const { data: followStatus } = useQuery({
    queryKey: ["follow-status", userProfile?.id],
    queryFn: async () => {
      if (!userProfile?.id || !session?.data?.user?.id) return null;
      const response = await axios.get(
        `/api/users/check-follow?userIds=${userProfile.id}`,
      );
      return response.data;
    },
    enabled: !!userProfile?.id && !!session?.data?.user?.id,
  });

  const followMutation = useMutation({
    mutationFn: async () => {
      if (!userProfile?.id || !session?.data?.user?.id) return null;
      const response = await axios.post(
        `/api/user/follow?userId=${userProfile.id}&action=${followStatus?.[userProfile.id] ? "unfollow" : "follow"}`
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate all relevant queries to ensure UI consistency
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["who-to-follow"] });
      queryClient.invalidateQueries({ queryKey: ["follow-status"] });
      queryClient.invalidateQueries({ queryKey: ["user-followers"] });
      queryClient.invalidateQueries({ queryKey: ["user-following"] });
      queryClient.invalidateQueries({ queryKey: ["explore"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user-data"] });
    },
    onError: () => {
      toast.error("Error occurred while following/unfollowing user");
    },
  });

  const { data: posts } = useQuery({
    queryKey: ["user-posts", userProfile?.id],
    queryFn: async () => {
      const response = await axios.get(`/api/user/posts?userId=${userProfile?.id}`);
      return response.data.data;
    },
    enabled: !!userProfile?.id,
  });

  useEffect(() => {
    if (userProfile) {
      setLoading(false);
    }
  }, [userProfile]);

  if (loading || isLoadingUser) {
    return (
      <div className="container relative mx-10 pb-8 font-geist">
        <div className="absolute -right-10 -top-20 hidden h-[300px] w-[300px] -rotate-45 rounded-full bg-gradient-to-br from-amber-300/10 to-transparent blur-[80px] dark:from-orange-300/10 md:block"></div>

        <div className="group relative mb-12 h-[400px] w-full overflow-hidden rounded-2xl md:h-[200px]">
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
            <div className="overflow-hidden rounded-xl border border-gray-100 bg-white dark:border-gray-500/5 dark:bg-black">
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

  if (!userProfile) {
    return (
      <div className="container relative mx-10 pb-8 font-geist">
        <div className="flex h-[50vh] items-center justify-center">
          <p className="text-muted-foreground">No user profile found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container relative mx-10 pb-8 font-geist">
      <div className="absolute -right-10 -top-20 hidden h-[300px] w-[300px] -rotate-45 rounded-full bg-gradient-to-br from-amber-300/10 to-transparent blur-[80px] dark:from-orange-300/10 md:block"></div>

      <div className="group relative mb-12 h-[400px] w-full overflow-hidden rounded-xl shadow-lg md:h-[250px]">
        <Image
          src={userProfile?.coverImage || "/obsession.jpg"}
          alt="Cover Image"
          fill
          quality={100}
          className="object-cover"
          priority={true}
        />
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-zinc-900/90 via-zinc-900/60 to-transparent p-8 dark:from-black/80 dark:via-black/50">
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-zinc-900/90 to-transparent dark:from-black"></div>
        </div>
      </div>

      <div className="relative z-10 mx-2 my-5 -mt-8 ml-5 flex flex-col items-start gap-1">
        <div className="relative -mt-16 h-20 w-20 shrink-0 overflow-hidden rounded-full ring-2 ring-white/20">
          <Image
            src={userProfile?.image || "/user.jpg?height=128&width=128"}
            alt={userProfile?.visualName || userProfile?.name || ""}
            fill
            className="object-cover"
          />
        </div>

        <div className="flex w-full flex-col">
          <div className="flex items-start justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h1 className="font-geist text-xl font-medium text-foreground">
                  {userProfile?.visualName || userProfile?.name}
                </h1>
                <Dot className="h-4 w-4 text-muted-foreground" />
                {session?.data?.user?.id !== userProfile?.id && (
                  <FollowButton
                    userId={userProfile?.id}
                    isCurrentUser={session?.data?.user?.id === userProfile?.id}
                    isFollowing={followStatus?.[userProfile?.id] || false}
                  />
                )}
              </div>
              <div className="flex items-center gap-2">
                <p className="font-geist text-sm text-muted-foreground">
                  Nerd@{userProfile?.nerdAt}
                </p>
                {userProfile?.country && (
                  <>
                    <Dot className="h-4 w-4 text-muted-foreground" />
                    <p className="font-geist text-sm text-muted-foreground">
                      {userProfile.country.emoji} {userProfile.country.name}
                    </p>
                  </>
                )}
              </div>
            </div>

            {userProfile?.link && (
              <div className="flex items-center gap-2">
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
                <a
                  href={userProfile.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-geist text-sm text-purple-500 hover:underline"
                >
                  {userProfile.link}
                </a>
              </div>
            )}
          </div>

          <div className="mt-1 flex flex-col gap-2">
            <div className="flex items-center">
              <p className="font-geist text-sm text-muted-foreground">
                {userProfile?.bio || "No bio"}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/user-profile/${userProfile?.id}/followers`}
                className="flex items-center gap-2 rounded-full border border-gray-100 bg-white px-4 py-1.5 shadow-sm hover:bg-gray-50 dark:border-gray-500/10 dark:bg-black dark:hover:bg-gray-900"
              >
                <Users className="h-3.5 w-3.5" />
                <span className="font-geist text-xs font-medium">
                  {userData?._count?.following || 0} Followers
                </span>
              </Link>
              <Link
                href={`/user-profile/${userProfile?.id}/following`}
                className="flex items-center gap-2 rounded-full border border-gray-100 bg-white px-4 py-1.5 shadow-sm hover:bg-gray-50 dark:border-gray-500/10 dark:bg-black dark:hover:bg-gray-900"
              >
                <Users className="h-3.5 w-3.5" />
                <span className="font-geist text-xs font-medium">
                  {userData?._count?.followers || 0} Following
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
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
                </TabsList>

                <TabsContent value="posts" className="mt-0">
                  <div className="space-y-4">
                    {posts?.map((post : postInterface, index : number) => (
                      <div
                        key={post.id}
                        onClick={() => handlePostClick(post)}
                        className="cursor-pointer"
                      >
                        <ExplorePostCard
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
                          handleFollow={handleFollow}
                          setCommentId={setCommentId}
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="projects" className="mt-0">
                  <UserProjectsTab />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
