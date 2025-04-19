"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import createPost from "@/functions/create-post";
import { authClient } from "@/lib/auth-client";
import { queryClient } from "@/providers/tanstack-query-provider";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { FolderIcon, MessagesSquareIcon, SmileIcon, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { HiPhoto } from "react-icons/hi2";
import { PostFileUploader } from "../media/post-file-uploader";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { AutosizeTextarea } from "../ui/resizeble-text-area";

import {
  EmojiPicker,
  EmojiPickerSearch,
  EmojiPickerContent,
  EmojiPickerFooter,
} from "@/components/ui/emoji-picker";

const cloudinaryUploadUrl = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL!;
const cloudinaryUploadPreset =
  process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

const PostInput = () => {
  const [dialogPost, setDialogPost] = useState<string>("");
  const [dialogFiles, setDialogFiles] = useState<File[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const session = authClient.useSession();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onEmojiClick = (emojiObject: any) => {
    const text = dialogPost;
    const before = text.slice(0, cursorPosition);
    const after = text.slice(cursorPosition);
    const newText = before + emojiObject.emoji + after;
    setDialogPost(newText);
    setCursorPosition(cursorPosition + emojiObject.emoji.length);
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setErrorMessage("");

    // Check if any word exceeds 10 characters
    const words = newText.split(/\s+/);
    const hasLongWord = words.some((word) => word.length > 10);

    if (hasLongWord) {
      setErrorMessage("Words cannot be longer than 10 characters");
      return;
    }

    // Check total character limit
    if (newText.length > 200) {
      setErrorMessage("Post cannot exceed 200 characters");
      return;
    }

    setDialogPost(newText);
    setCursorPosition(e.target.selectionStart);
  };

  const { mutate, isPending } = useMutation({
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
      console.log(error);
      toast.error("An error occurred while uploading files");
    } finally {
      setIsUploading(false);
    }
  };

  if (!session) {
    router.push("/login");
  }

  return (
    <div className="mx-auto mb-6 w-[93vw] rounded-2xl border border-gray-100 bg-white shadow-sm transition-all dark:border-gray-700/10 dark:bg-black md:w-full">
      <div className="flex items-center gap-4 border-b border-gray-100 p-4 dark:border-gray-800/30">
        <div className="relative">
          {mounted && (
            <Image
              src={session?.data?.user?.image || "/user.jpg"}
              alt="user"
              className="size-10 rounded-full border-2 border-gray-50 shadow-sm dark:border-gray-800"
              height={40}
              width={40}
              priority
            />
          )}
          {mounted && (
            <div className="absolute -bottom-1 -right-1 size-3 rounded-full border-2 border-white bg-green-500 dark:border-gray-900" />
          )}
        </div>
        <h3 className="font-medium text-gray-800 dark:text-gray-200">
          {mounted ? session?.data?.user?.name || "User" : "User"}
        </h3>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div className="p-4">
            <div className="flex w-full cursor-pointer items-start rounded-xl border border-gray-200 bg-gray-50/80 px-4 py-3 transition-all hover:border-gray-300 dark:border-gray-800/30 dark:bg-gray-800/20">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                What&apos;s on your mind?
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
              <span className="hidden md:block">Document</span>
            </Button>
            <Button
              disabled
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300"
            >
              <MessagesSquareIcon />
              <span className="hidden md:block">Poll</span>
            </Button>
          </div>
          <Button
            disabled
            variant="ghost"
            size="sm"
            className="rounded-lg bg-gray-100 text-sm font-medium text-gray-700 hover:bg-gray-200 dark:bg-black dark:text-gray-300 dark:hover:bg-gray-700"
          >
            <span className="hidden md:block">Post</span>
          </Button>
        </div>

        <DialogContent className="max-w-2xl overflow-hidden rounded-2xl border-gray-200 p-0 dark:border-gray-500/10 dark:bg-black">
          <div className="relative">
            {/* Glow effects */}
            <div className="absolute -right-4 size-32 -rotate-45 rounded-full border border-primary/50 bg-gradient-to-br from-primary/40 via-primary/50 to-transparent blur-[150px] backdrop-blur-sm"></div>
            <div className="absolute -bottom-5 left-12 size-32 rotate-45 rounded-full border border-secondary/50 bg-gradient-to-tl from-secondary/40 via-secondary/30 to-transparent blur-[150px] backdrop-blur-sm"></div>

            <div className="border-b border-gray-200 px-6 py-4 dark:border-black">
              <DialogTitle className="text-xl font-semibold tracking-tight">
                Create post
              </DialogTitle>
            </div>

            <div className="p-6">
              <div className="mb-6 flex items-center gap-4">
                {mounted && (
                  <Image
                    src={session?.data?.user?.image || "/user.jpg"}
                    alt="user"
                    className="size-12 rounded-full border-2 border-gray-50 shadow-sm dark:border-gray-800"
                    height={48}
                    width={48}
                    priority
                  />
                )}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-gray-100">
                    {mounted ? session?.data?.user?.name || "User" : "User"}
                  </h4>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Public post
                  </span>
                </div>
              </div>

              <div className="relative">
                <AutosizeTextarea
                  maxHeight={500}
                  placeholder="What's on your mind? (200 characters max, 10 characters per word)"
                  className="min-h-[200px] w-full rounded-xl border bg-transparent text-base outline-none placeholder:text-gray-400 focus:outline-none focus:ring-0 focus-visible:ring-0 dark:border-gray-500/10 dark:placeholder:text-gray-500"
                  value={dialogPost}
                  onChange={handleTextareaChange}
                  onSelect={(e) =>
                    setCursorPosition(e.currentTarget.selectionStart)
                  }
                  maxLength={300}
                />
                <div className="flex items-center justify-between px-4">
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-gray-500">
                      {dialogPost.length}/200 characters
                    </div>
                    {errorMessage && (
                      <div className="text-sm text-red-500">{errorMessage}</div>
                    )}
                  </div>
                  <div className="py-2">
                    <Popover onOpenChange={setIsOpen} open={isOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="flex items-center gap-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                        >
                          <SmileIcon className="h-5 w-5" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-fit p-0">
                        <EmojiPicker
                          className="h-[342px]"
                          onEmojiSelect={({ emoji }) => {
                            setIsOpen(false);
                            onEmojiClick({ emoji });
                          }}
                        >
                          <EmojiPickerSearch />
                          <EmojiPickerContent />
                          <EmojiPickerFooter />
                        </EmojiPicker>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pb-4">
                <div className="flex items-center gap-2">
                  <PostFileUploader onFilesSelected={setDialogFiles} />

                  <Button
                    disabled
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300"
                  >
                    <FolderIcon />
                    <span className="hidden md:block">Document</span>
                  </Button>
                  <Button
                    disabled
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300"
                  >
                    <MessagesSquareIcon />
                    <span className="hidden md:block">Poll</span>
                  </Button>
                </div>
              </div>

              {dialogFiles.length > 0 && (
                <div className="flex flex-wrap items-center gap-4">
                  {dialogFiles.map((file) => (
                    <div
                      key={file.name}
                      className="group relative aspect-square size-40 overflow-hidden rounded-xl border border-gray-200 shadow-sm transition-all hover:shadow-md dark:border-gray-800"
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
                          className="absolute right-2 top-2 h-8 w-fit rounded-full bg-black/60 px-2 hover:bg-black/80 dark:bg-black/80"
                          onClick={() => handleRemoveFile(file.name)}
                        >
                          <X className="size-8 text-white" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-gray-200 p-6 dark:border-gray-800">
              <Button
                onClick={handleSubmit}
                className="w-full rounded-xl py-3 text-sm font-medium shadow-sm transition-all hover:shadow-md"
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
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PostInput;
