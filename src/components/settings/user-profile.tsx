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
  const { userProfile, setUserProfile } = useUserProfileStore();
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

  const handleFollow = (post: postInterface) => {
    followMutation.mutate();
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

  const likeMutation = useMutation({
    mutationFn: async (postId: string) => {
      const response = await axios.post(`/api/posts/${postId}/like`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post liked successfully");
    },
    onError: () => {
      toast.error("Error liking post");
    },
  });

  const bookmarkMutation = useMutation({
    mutationFn: async (postId: string) => {
      const response = await axios.post(`/api/posts/${postId}/bookmark`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post bookmarked successfully");
    },
    onError: () => {
      toast.error("Error bookmarking post");
    },
  });

  const handleLike = (postId: string) => {
    likeMutation.mutate(postId);
  };

  const handleBookmark = (postId: string) => {
    bookmarkMutation.mutate(postId);
  };

  const handleCommentToggle = (postId: string) => {
    // Toggle comment section visibility
    setCommentShown((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleMediaClick = (index: number, images: string[]) => {
    // Handle media click - you can implement a modal or lightbox here
    console.log("Media clicked:", index, images);
  };

  useEffect(() => {
    if (userProfile) {
      setUserProfile(userProfile);
    }
  }, [userProfile, setUserProfile]);

  useEffect(() => {
    if (userProfile) {
      setLoading(false);
    }
  }, [userProfile]);

  if (loading || isLoadingUser) {
    return (
      <div className="relative mx-10 pb-8 font-geist container">
        <div className="hidden md:block -top-20 -right-10 absolute bg-gradient-to-br from-amber-300/10 dark:from-orange-300/10 to-transparent blur-[80px] rounded-full w-[300px] h-[300px] -rotate-45" />

        <div className="group relative mb-12 rounded-2xl w-full h-[400px] md:h-[200px] overflow-hidden">
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
            <div className="bg-white dark:bg-black border border-gray-100 dark:border-gray-500/5 rounded-xl overflow-hidden">
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

  if (!userProfile) {
    return (
      <div className="relative mx-10 pb-8 font-geist container">
        <div className="flex justify-center items-center h-[50vh]">
          <p className="text-muted-foreground">No user profile found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative md:mx-10 mt-5 pb-8 w-[94%] font-geist container">
      <div className="hidden md:block -top-20 md:-right-10 absolute bg-gradient-to-br from-amber-300/10 dark:from-orange-300/10 to-transparent blur-[80px] rounded-full w-[300px] h-[300px] -rotate-45" />

      <div className="group relative shadow-lg mx-auto mb-12 rounded-2xl h-[250px] md:h-[250px] overflow-hidden">
        <Image
          src={userProfile?.coverImage || "/obsession.jpg"}
          alt="Cover Image"
          fill
          quality={100}
          className="object-cover"
          priority={true}
          sizes="100vw"
        />
        <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-zinc-900/90 dark:from-black/80 via-zinc-900/60 dark:via-black/50 to-transparent p-8">
          <div className="right-0 bottom-0 left-0 absolute bg-gradient-to-t from-zinc-900/90 dark:from-black to-transparent h-32" />
        </div>
      </div>

      <div className="z-10 relative flex flex-col items-start gap-1 mx-2 my-5 -mt-8 ml-5">
        <div className="relative -mt-16 rounded-full ring-2 ring-white/20 w-20 h-20 overflow-hidden shrink-0">
          <Image
            src={userProfile?.image || "/user.jpg?height=128&width=128"}
            alt={userProfile?.visualName || userProfile?.name || ""}
            fill
            className="object-cover"
            sizes="80px"
          />
        </div>

        <div className="flex flex-col w-full">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <h1 className="font-geist font-medium text-foreground text-xl">
                {userProfile?.visualName || userProfile?.name}
              </h1>
              <div className="flex items-center gap-2">
                <p className="font-geist text-muted-foreground text-sm">
                  Nerd@{userProfile?.nerdAt}
                </p>
                {userProfile?.country && (
                  <>
                    <Dot className="w-4 h-4 text-muted-foreground" />
                    <p className="font-geist text-muted-foreground text-sm">
                      {userProfile.country.emoji} {userProfile.country.name}
                    </p>
                  </>
                )}
              </div>
            </div>

            {userProfile?.link && (
              <div className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-muted-foreground" />
                <a
                  href={userProfile.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-geist text-purple-500 text-sm hover:underline"
                >
                  {userProfile.link}
                </a>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 mt-1">
            <div className="flex items-center">
              <p className="font-geist text-muted-foreground text-sm">
                {userProfile?.bio || "No bio"}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Link
                href={`/user-profile/${userProfile?.id}/followers`}
                className="flex items-center gap-2 bg-white hover:bg-gray-50 dark:bg-black dark:hover:bg-gray-900 shadow-sm px-5 py-2.5 border border-gray-100 dark:border-gray-500/10 rounded-full"
              >
                <Users className="w-4 h-4" />
                <span className="font-geist font-medium text-sm">
                  {userData?._count?.following || 0} Followers
                </span>
              </Link>
              <Link
                href={`/user-profile/${userProfile?.id}/following`}
                className="flex items-center gap-2 bg-white hover:bg-gray-50 dark:bg-black dark:hover:bg-gray-900 shadow-sm px-5 py-2.5 border border-gray-100 dark:border-gray-500/10 rounded-full"
              >
                <Users className="w-4 h-4" />
                <span className="font-geist font-medium text-sm">
                  {userData?._count?.followers || 0} Following
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
                </TabsList>

                <TabsContent value="posts" className="mt-0">
                  <div className="space-y-4">
                    {posts?.map((post: postInterface, index: number) => (
                      <ExplorePostCard
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
                        setEditModal={setModalEditOpened}
                        setDeleteModal={setModalDeleteOpened}
                        changePostAccessType={changePostAccessType}
                        handleFollow={handleFollow}
                        setCommentId={setCommentId}
                      />
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
