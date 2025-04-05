"use client";

import type { CommunityInterface } from "@/interface/auth/community.interface";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  ArrowLeft,
  Calendar,
  Heart,
  ImagePlus,
  Info,
  MessageCircle,
  MoreHorizontal,
  PenSquare,
  Search,
  Shield,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ScreenView = "feed" | "members" | "about" | "create-post";

const CommunityDetail = ({ id }: { id: string }) => {
  const router = useRouter();
  const [currentView, setCurrentView] = useState<ScreenView>("feed");
  const [newPost, setNewPost] = useState("");
  const [isJoined, setIsJoined] = useState(true);

  const { data, isLoading, error, refetch } = useQuery<CommunityInterface>({
    queryKey: ["CommunityDetail", id],
    queryFn: async () => {
      const response = await axios.get(`/api/community/${id}`);
      return response.data;
    },
  });

  const handleCreatePost = () => {
    // Handle post creation logic here
    console.log("Creating post:", newPost);
    setNewPost("");
    setCurrentView("feed");
  };

  const handleJoinCommunity = () => {
    setIsJoined(!isJoined);
    // API call to join/leave community would go here
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-3xl p-6">
        <div className="mb-8 flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div>
            <Skeleton className="mb-2 h-6 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        <div className="mb-8">
          <Skeleton className="mb-6 h-10 w-full" />
          <Skeleton className="h-[200px] w-full rounded-lg" />
        </div>

        <div className="space-y-4">
          <Skeleton className="h-[120px] w-full rounded-lg" />
          <Skeleton className="h-[120px] w-full rounded-lg" />
          <Skeleton className="h-[120px] w-full rounded-lg" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-3xl p-6">
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error Loading Community</AlertTitle>
          <AlertDescription>
            We couldn't load the community details. Please try again.
            <div className="mt-2">
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Retry
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!data) return null;

  // Header component that's consistent across all views
  const CommunityHeader = () => (
    <div className="mb-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex flex-1 items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/community")}
            className="h-9 w-9 rounded-full"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-4">
            <Avatar className="h-14 w-14 border-2 border-background shadow-sm">
              <AvatarImage
                src={`/placeholder.svg?height=56&width=56`}
                alt={data.name}
              />
              <AvatarFallback className="text-lg font-medium">
                {data.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex flex-col flex-wrap items-start gap-x-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="mr-1.5 h-3.5 w-3.5" />
                  <span>{data.members.length} members</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
                  <span>{data.posts.length} posts</span>
                </div>
                {/* <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-1.5 h-3.5 w-3.5" />
              <span>
                Created {new Date(data.createdAt).toLocaleDateString()}
              </span>
            </div> */}
              </div>

              {data.category && (
                <Badge variant="secondary" className="mt-1">
                  {data.category.name}
                </Badge>
              )}
            </div>

            <Button
              variant={isJoined ? "outline" : "default"}
              size="sm"
              onClick={handleJoinCommunity}
              className={
                isJoined
                  ? "border-primary/30 text-primary hover:bg-primary/10"
                  : ""
              }
            >
              {isJoined ? "Joined" : "Join"}
            </Button>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px]">
            <DropdownMenuItem>
              <Info className="mr-2 h-4 w-4" />
              Community Info
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Shield className="mr-2 h-4 w-4" />
              Report Community
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Users className="mr-2 h-4 w-4" />
              Invite Members
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>


      <Separator />
    </div>
  );

  // Feed View
  const FeedView = () => (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-medium">Recent Posts</h2>
        <Button
          onClick={() => setCurrentView("create-post")}
          size="sm"
          className="gap-2"
        >
          <PenSquare className="h-3.5 w-3.5" />
          Create Post
        </Button>
      </div>

      {data.posts.length > 0 ? (
        <div className="space-y-5">
          {data.posts.map((post, index) => (
            <Card
              key={index}
              className="overflow-hidden shadow-sm transition-shadow duration-200 hover:shadow"
            >
              <CardHeader className="flex flex-row items-start gap-3 space-y-0 p-4 pb-2">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src={`/placeholder.svg?height=36&width=36`}
                    alt={post.user.visualName as string}
                  />
                  <AvatarFallback>
                    {post.user.visualName &&
                      post.user.visualName.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        {post.user.visualName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {post.createdAt
                          ? new Date(post.createdAt).toLocaleString(undefined, {
                              month: "short",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "Recently"}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem>Save Post</DropdownMenuItem>
                        <DropdownMenuItem>Copy Link</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Report Post
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-4 pt-2">
                <p className="text-sm">{post.content || "No content"}</p>

                {/* Sample post image - conditionally render based on post data */}
                {index % 3 === 0 && (
                  <div className="mt-3 overflow-hidden rounded-md">
                    <img
                      src="/placeholder.svg?height=200&width=400"
                      alt="Post image"
                      className="h-auto w-full object-cover"
                    />
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex gap-4 border-t px-4 py-3">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 rounded-full text-muted-foreground hover:bg-primary/10 hover:text-primary"
                >
                  <Heart className="mr-1.5 h-3.5 w-3.5" />
                  {Math.floor(Math.random() * 50)}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 rounded-full text-muted-foreground hover:bg-primary/10 hover:text-primary"
                >
                  <MessageCircle className="mr-1.5 h-3.5 w-3.5" />
                  {Math.floor(Math.random() * 20)}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-dashed shadow-sm">
          <CardContent className="p-8 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <MessageCircle className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-1 text-lg font-medium">No posts yet</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Be the first to share something with this community
            </p>
            <Button onClick={() => setCurrentView("create-post")} size="sm">
              Create First Post
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // Members View
  const MembersView = () => (
    <div>
      <div className="mb-6">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search members" className="bg-muted/40 pl-9" />
        </div>

        <div className="space-y-3">
          {data.members.map((member, index) => (
            <Card
              key={index}
              className="shadow-sm transition-shadow duration-200 hover:shadow"
            >
              <CardContent className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage
                      src={`/placeholder.svg?height=40&width=40`}
                      alt={member.user.visualName as string}
                    />
                    <AvatarFallback>
                      {member.user.visualName &&
                        member.user.visualName.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {member.user.visualName}
                    </p>
                    {member.role && (
                      <div className="mt-0.5 flex items-center text-xs text-muted-foreground">
                        {(member.role as string) === "admin" && (
                          <Shield className="mr-1 h-3 w-3 text-primary" />
                        )}
                        {member.role}
                      </div>
                    )}
                  </div>
                </div>
                {(member.role as string) === "admin" ? (
                  <Badge
                    variant="outline"
                    className="border-primary/30 text-xs text-primary"
                  >
                    Admin
                  </Badge>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 rounded-full"
                  >
                    Follow
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  // About View
  const AboutView = () => (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <h3 className="text-lg font-medium">About Community</h3>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="mb-6 text-sm text-muted-foreground">
            {data.description}
          </p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="rounded-lg bg-muted/30 p-3">
              <div className="mb-1 text-muted-foreground">Created</div>
              <div className="font-medium">
                {new Date(data.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div className="rounded-lg bg-muted/30 p-3">
              <div className="mb-1 text-muted-foreground">Creator</div>
              <div className="font-medium">{data.creator.name}</div>
            </div>
            <div className="rounded-lg bg-muted/30 p-3">
              <div className="mb-1 text-muted-foreground">Members</div>
              <div className="font-medium">{data.members.length}</div>
            </div>
            <div className="rounded-lg bg-muted/30 p-3">
              <div className="mb-1 text-muted-foreground">Posts</div>
              <div className="font-medium">{data.posts.length}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm">
        <CardHeader className="pb-2">
          <h3 className="text-lg font-medium">Community Rules</h3>
        </CardHeader>
        <CardContent className="pt-0">
          <ol className="space-y-3 text-sm">
            <li className="flex items-start gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                1
              </div>
              <div>
                <p className="font-medium">Be respectful to other members</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Treat others as you would like to be treated
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                2
              </div>
              <div>
                <p className="font-medium">No spam or self-promotion</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Keep discussions relevant and valuable
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                3
              </div>
              <div>
                <p className="font-medium">Stay on topic</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Keep discussions relevant to the community
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                4
              </div>
              <div>
                <p className="font-medium">No hate speech or bullying</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Create a safe environment for everyone
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                5
              </div>
              <div>
                <p className="font-medium">Follow platform guidelines</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Adhere to the overall platform rules
                </p>
              </div>
            </li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );

  // Create Post View
  const CreatePostView = () => (
    <div>
      <div className="mb-6 flex items-center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCurrentView("feed")}
          className="mr-2 h-9 w-9 rounded-full"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-medium">Create Post</h2>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10 border">
              <AvatarImage
                src="/placeholder.svg?height=40&width=40"
                alt="Your profile"
              />
              <AvatarFallback>YO</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="mb-1 text-sm font-medium">Posting to {data.name}</p>
              <Textarea
                placeholder="Share something with the community..."
                className="mb-4 mt-1 min-h-[120px] resize-none focus-visible:ring-primary"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 rounded-full"
                >
                  <ImagePlus className="h-3.5 w-3.5" />
                  Add Image
                </Button>
                <Button
                  onClick={handleCreatePost}
                  disabled={!newPost.trim()}
                  className="px-5"
                >
                  Post
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="container mx-auto max-w-3xl p-6">
      <CommunityHeader />
      <FeedView />

      {/* {currentView === "create-post" && <CreatePostView />} */}
    </div>
  );
};

export default CommunityDetail;
