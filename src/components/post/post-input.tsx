"use client";

import createPost from "@/functions/create-post";
import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/providers/tanstack-query-provider";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "../ui/button";
import { AutosizeTextarea } from "../ui/resizeble-text-area";
import { PostFileUploader } from "../media/post-file-uploader";
import axios from "axios";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "../ui/dialog";
import { FolderIcon, MessagesSquareIcon, X } from "lucide-react";
import { HiPhoto } from "react-icons/hi2";

const cloudinaryUploadUrl = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL!;
const cloudinaryUploadPreset =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

const PostInput = () => {
  const [dialogPost, setDialogPost] = useState<string>("");
  const [dialogFiles, setDialogFiles] = useState<File[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const session = authClient.useSession();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);

  const { mutate, isPending, isError } = useMutation({
    mutationKey: ["create-post"],
    mutationFn: createPost,
    onSuccess: () => {
      toast.success("Post created successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: () => {
      toast.error("An error occurred while creating post");
    },
  });

  const handleRemoveFile = (fileName: string) => {
    setDialogFiles(dialogFiles.filter((file) => file.name !== fileName));
  };

  const handleSubmit = async () => {
    if (dialogPost.trim() === "") {
      toast.error("Post content cannot be empty.");
      return;
    }

    setIsUploading(true);
    try {
      const fileUrls = await Promise.all(
        dialogFiles.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", cloudinaryUploadPreset);

          const response = await axios.post(cloudinaryUploadUrl, formData);
          return response.data.secure_url;
        }),
      );

      mutate({ content: dialogPost, fileUrls });
      setDialogPost("");
      setDialogFiles([]);
      setIsDialogOpen(false);
    } catch (error) {
      toast.error("An error occurred while uploading files");
    } finally {
      setIsUploading(false);
    }
  };

  if (!session) {
    router.push("/login");
  }

  return (
    <div className="mb-6 w-full rounded-2xl border border-gray-100 bg-white shadow-sm transition-all dark:border-gray-700/10 dark:bg-black">
      <div className="flex items-center gap-4 border-b border-gray-100 p-4 dark:border-gray-800/30">
        <div className="relative">
          <Image
            src={session?.data?.user?.image || "/user.jpg"}
            alt="user"
            className="size-10 rounded-full border-2 border-gray-50 shadow-sm dark:border-gray-800"
            height={200}
            width={200}
          />
          <div className="absolute -bottom-1 -right-1 size-3 rounded-full border-2 border-white bg-green-500 dark:border-gray-900" />
        </div>
        <h3 className="font-medium text-gray-800 dark:text-gray-200">
          {session?.data?.user?.name || "User"}
        </h3>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div className="p-4">
            <div className="flex w-full cursor-pointer items-start rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-3 transition-all hover:border-gray-300 dark:border-gray-800/30 dark:bg-gray-800/20">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                What's on your mind?
              </span>
            </div>
          </div>
        </DialogTrigger>

        <div className="flex items-center justify-between px-4 pb-4">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300"
            >
              <HiPhoto />
              Photo
            </Button>
            <Button
              disabled
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300"
            >
              <FolderIcon />
              Document
            </Button>
            <Button
              disabled
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300"
            >
              <MessagesSquareIcon />
              Poll
            </Button>
          </div>
          <Button
            disabled
            variant="ghost"
            size="sm"
            className="rounded-lg bg-gray-100 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-black dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Post
          </Button>
        </div>

        <DialogContent className="max-w-2xl overflow-hidden rounded-2xl border-gray-200 p-0 dark:border-gray-800 dark:bg-gray-900">
          <div className="border-b border-gray-200 p-4 dark:border-gray-800">
            <DialogTitle className="text-xl font-semibold tracking-tight">
              Create post
            </DialogTitle>
          </div>

          <div className="p-4">
            <div className="mb-4 flex items-center gap-3">
              <Image
                src={session?.data?.user?.image || "/user.jpg"}
                alt="user"
                className="size-10 rounded-full border-2 border-gray-50"
                height={200}
                width={200}
              />
              <div>
                <h4 className="font-medium text-gray-900 dark:text-gray-100">
                  {session?.data?.user?.name || "User"}
                </h4>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Public post
                </span>
              </div>
            </div>

            <AutosizeTextarea
              maxHeight={300}
              placeholder="What's on your mind?"
              className="h-32 w-full border-0 bg-transparent text-base placeholder:text-gray-400 focus:ring-0 dark:placeholder:text-gray-500"
              value={dialogPost}
              onChange={(e) => setDialogPost(e.target.value)}
            />
          </div>

          <div className="border-t border-gray-200 p-4 dark:border-gray-800">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                Add to your post
              </h4>
              <PostFileUploader onFilesSelected={setDialogFiles} />
            </div>

            {dialogFiles.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {dialogFiles.map((file) => (
                  <div
                    key={file.name}
                    className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800"
                  >
                    <div className="relative h-full w-full bg-gray-50 dark:bg-gray-800/30">
                      <img
                        src={URL.createObjectURL(file) || "/placeholder.svg"}
                        alt={file.name}
                        className="h-full w-full object-cover"
                      />
                      <Button
                        variant="secondary"
                        size="icon"
                        className="absolute right-1 top-1 h-6 w-6 rounded-full bg-black/60 hover:bg-black/80 dark:bg-black/80"
                        onClick={() => handleRemoveFile(file.name)}
                      >
                        <X className="h-3 w-3 text-white" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 p-4 dark:border-gray-800">
            <Button
              onClick={handleSubmit}
              className="w-full rounded-lg py-2.5 text-sm font-medium"
              disabled={isPending || isUploading || dialogPost.trim() === ""}
            >
              {isPending || isUploading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {isUploading ? "Uploading..." : "Posting..."}
                </div>
              ) : (
                "Post"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PostInput;
