import { getTrimLimit } from "@/functions/render-helper";
import postInterface from "@/interface/auth/post.interface";
import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/providers/tanstack-query-provider";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { MessageCircle, MoreHorizontal, Share2Icon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { GoHeart, GoHeartFill } from "react-icons/go";
import { HiBookmark, HiOutlineBookmark } from "react-icons/hi2";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import ImagePreviewDialog from "../image-preview";

interface ExplorePostCardProps {
  post: postInterface;
}

const ExplorePostCard = ({ post }: ExplorePostCardProps) => {
  const router = useRouter();
  const session = authClient.useSession();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(
    null,
  );
  const [selectedPostImages, setSelectedPostImages] = useState<string[]>([]);

  const contentWords = post.content.split(" ");
  const trimLimit = getTrimLimit();
  const truncatedContent = contentWords.slice(0, trimLimit).join(" ");
  const isLongContent = contentWords.length > trimLimit;

  const likeMutation = useMutation({
    mutationFn: async (postId: string) => {
      const response = await axios.post("/api/post/like", {
        postId,
        userId: session.data?.user.id,
      });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: () => {
      toast.error("Error occurred while liking/unliking post");
    },
  });

  const bookmarkMutation = useMutation({
    mutationFn: async (postId: string) => {
      const response = await axios.post("/api/post/bookmark", {
        postId,
        userId: session.data?.user.id,
      });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: () => {
      toast.error("Error occurred while bookmarking/unbookmarking post");
    },
  });

  const handleLike = (postId: string) => {
    likeMutation.mutate(postId);
  };

  const handleBookmark = (postId: string) => {
    bookmarkMutation.mutate(postId);
  };

  const handleMediaClick = (index: number, images: string[]) => {
    setSelectedMediaIndex(index);
    setSelectedPostImages(images);
    setIsDialogOpen(true);
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

  const handleUserProfileClick = (userId: string) => {
    router.push(`/user-profile/${userId}`);
  };

  return (
    <Card 
      className="group relative my-2 max-w-lg overflow-hidden border-border/50 transition-all duration-300 cursor-pointer"
      onClick={() => router.push(`/post/${post.id}`)}
    >
      <div className="p-3">
        <div className="flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-2">
            <Image
              src={post.user.image || "/user.jpg"}
              alt="user"
              className="size-5 cursor-pointer rounded-full shadow-[0_0_3px_rgba(0,122,255,0.5),0_0_5px_rgba(255,165,0,0.5),0_0_7px_rgba(0,122,255,0.4)] transition-all"
              height={100}
              width={100}
              onClick={() => handleUserProfileClick(post.user.id)}
            />
            <div
              onClick={() => handleUserProfileClick(post.user.id)}
              className="cursor-pointer"
            >
              <h1 className="text-xs font-medium">{post.user.name}</h1>
              <h1 className="text-[10px] text-muted-foreground">
                Nerd@{post.user.nerdAt}
              </h1>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Share2Icon className="mr-2 h-3 w-3" />
                Share
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="mt-2">
          {post.media.length > 0 && (
            <div className={`grid gap-1 ${getGridClass(post.media.length)}`}>
              {post.media.map((media, index) => (
                <div
                  key={media.id}
                  className="relative aspect-square cursor-pointer overflow-hidden rounded-md"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleMediaClick(
                      index,
                      post.media.map((m) => m.url),
                    );
                  }}
                >
                  <Image
                    fill
                    src={media.url}
                    alt="Post media"
                    className="size-60 object-cover"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="mt-2">
            <p className="line-clamp-2 text-sm">
              {isLongContent ? `${truncatedContent}...` : post.content}
            </p>
          </div>

          <div className="mt-2 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => handleLike(post.id)}
            >
              {post.likes.some(
                (like) => like.userId === session.data?.user.id,
              ) ? (
                <GoHeartFill className="h-3 w-3 text-red-500" />
              ) : (
                <GoHeart className="h-3 w-3" />
              )}
              <span className="ml-1 text-[10px]">{post.likes.length}</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MessageCircle className="h-3 w-3" />
              {/* <span className="ml-1 text-[10px]">{post.comments.length}</span> */}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => handleBookmark(post.id)}
            >
              {post.bookmarks.some(
                (bookmark) => bookmark.userId === session.data?.user.id,
              ) ? (
                <HiBookmark className="h-3 w-3 text-primary" />
              ) : (
                <HiOutlineBookmark className="h-3 w-3" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <ImagePreviewDialog
        images={selectedPostImages}
        initialIndex={selectedMediaIndex || 0}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </Card>
  );
};

export default ExplorePostCard;
