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
import { Textarea } from "../ui/textarea";
import { AutosizeTextarea } from "../ui/resizeble-text-area";
import { PostFileUploader } from "../media/post-file-uploader";
import axios from "axios";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../ui/dialog";
import { X } from "lucide-react";

const cloudinaryUploadUrl = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL!;
const cloudinaryUploadPreset =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

const PostInput = () => {
  const [dialogPost, setDialogPost] = useState<string>("");
  const [dialogFiles, setDialogFiles] = useState<File[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const session = authClient.useSession();
  const router = useRouter();

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
    }
  };

  if (!session) {
    router.push("/login");
  }

  return (
    <div className="mb-6 w-full rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-gray-500/5 dark:bg-textAlternative">
      <div className="flex items-start gap-3">
        <div className="relative">
          <Image
            src={session?.data?.user?.image || "/user.jpg"}
            alt="user"
            className="size-10 rounded-full border-2 border-primary/20"
            height={200}
            width={200}
          />
          <div className="absolute -bottom-1 -right-1 size-3 rounded-full border-2 border-white bg-green-500 dark:border-textAlternative" />
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <div className="flex flex-1 cursor-pointer flex-col gap-3">
              <div className="flex w-full items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-2.5 transition-all hover:border-primary/50 dark:border-gray-500/5 dark:bg-gray-500/5">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  What's on your mind?
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 rounded-full hover:bg-primary/10"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
                      <line x1="4" y1="22" x2="4" y2="15" />
                    </svg>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-500/5">
                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 text-sm text-gray-500 hover:bg-primary/10 hover:text-primary dark:text-gray-400"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                    </svg>
                    Comment
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 text-sm text-gray-500 hover:bg-primary/10 hover:text-primary dark:text-gray-400"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Share
                  </Button>
                </div>
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-2xl dark:bg-textAlternative">
            <DialogTitle className="font-instrument text-3xl font-thin">
              Create a new post
            </DialogTitle>
            <DialogDescription>
              Share your thoughts or upload an image.
            </DialogDescription>
            <div className="mt-4 flex items-start gap-3">
              <Image
                src={session?.data?.user?.image || "/user.jpg"}
                alt="user"
                className="size-10 rounded-full border-2 border-primary/20"
                height={200}
                width={200}
              />
              <AutosizeTextarea
                maxHeight={300}
                placeholder="What's on your mind?"
                className="h-14 w-full border-gray-100 bg-transparent font-inter text-sm placeholder:text-sm dark:border-gray-500/5 md:text-base"
                value={dialogPost}
                onChange={(e) => setDialogPost(e.target.value)}
              />
            </div>
            <PostFileUploader onFilesSelected={setDialogFiles} />
            {dialogFiles.length > 0 && (
              <div className="mt-4 grid grid-cols-2 gap-3">
                {dialogFiles.map((file) => (
                  <div
                    key={file.name}
                    className="group relative h-40 overflow-hidden rounded-lg border dark:border-gray-500/5"
                  >
                    <div className="relative h-full w-full bg-gray-100 dark:bg-gray-500/5">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute right-2 top-2 flex gap-1">
                        <Button
                          variant="secondary"
                          size="icon"
                          className="h-7 w-7 bg-white/80 backdrop-blur-sm hover:bg-white"
                          onClick={() => handleRemoveFile(file.name)}
                        >
                          <X className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6 flex justify-end gap-3">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="text-sm dark:bg-textAlternative"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={handleSubmit}
                className="text-sm"
                disabled={isPending || dialogPost.trim() === ""}
              >
                {isPending ? "Posting..." : "Post"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default PostInput;
