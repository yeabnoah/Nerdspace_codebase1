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
import { useEffect, useState, useRef, type DragEvent } from "react";
import { toast } from "react-hot-toast";
import { HiPhoto } from "react-icons/hi2";
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
  const [dialogFiles, setDialogFiles] = useState<{ id: string; file: File }[]>(
    [],
  );
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const session = authClient.useSession();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

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

  const validateText = (text: string): { isValid: boolean; error: string } => {
    return { isValid: true, error: "" };
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
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

  const handleRemoveFile = (id: string) => {
    setDialogFiles(dialogFiles.filter((file) => file.id !== id));
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    const imageFiles = Array.from(items)
      .filter((item) => item.type.startsWith("image/"))
      .map((item) => item.getAsFile())
      .filter((file): file is File => file !== null);

    if (imageFiles.length > 0) {
      handleFiles(imageFiles);
    }
  };

  const handleFiles = (files: File[]) => {
    const acceptedTypes = ["image/jpeg", "image/png", "image/gif"];
    const maxSize = 50; // 50MB
    const maxFiles = 4;

    if (dialogFiles.length + files.length > maxFiles) {
      toast.error(`You can only upload up to ${maxFiles} images.`);
      return;
    }

    const validFiles = files.filter((file) => {
      if (!acceptedTypes.includes(file.type)) {
        toast.error(`File type ${file.type} is not supported.`);
        return false;
      }

      if (file.size > maxSize * 1024 * 1024) {
        toast.error(
          `File ${file.name} exceeds the maximum size of ${maxSize}MB.`,
        );
        return false;
      }

      return true;
    });

    const newFiles = validFiles.map((file) => ({
      id: crypto.randomUUID(),
      file,
    }));

    setDialogFiles([...dialogFiles, ...newFiles]);
  };

  const handleSubmit = async () => {
    if (dialogPost.trim() === "") {
      toast.error("Post content cannot be empty.");
      return;
    }

    setIsUploading(true);
    try {
      const fileUrls = await Promise.all(
        dialogFiles.map(async ({ file }) => {
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
    <div className="bg-white dark:bg-black shadow-sm mx-auto mb-6 border border-gray-100 dark:border-gray-700/10 rounded-2xl w-[93vw] md:w-full transition-all">
      <div className="flex items-center gap-4 p-4 border-gray-100 dark:border-gray-800/30 border-b">
        <div className="relative">
          {mounted && (
            <Image
              src={session?.data?.user?.image || "/user.jpg"}
              alt="user"
              className="shadow-sm border-2 border-gray-50 dark:border-gray-800 rounded-full size-10"
              height={40}
              width={40}
              priority
            />
          )}
          {mounted && (
            <div className="-right-1 -bottom-1 absolute bg-green-500 border-2 border-white dark:border-gray-900 rounded-full size-3" />
          )}
        </div>
        <h3 className="font-medium text-gray-800 dark:text-gray-200">
          {mounted ? session?.data?.user?.name || "User" : "User"}
        </h3>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div className="p-4">
            <div className="flex items-start bg-gray-50/80 dark:bg-gray-800/20 px-4 py-3 border border-gray-200 hover:border-gray-300 dark:border-gray-800/30 rounded-xl w-full transition-all cursor-pointer">
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                What&apos;s on your mind?
              </span>
            </div>
          </div>
        </DialogTrigger>

        <div className="flex justify-between items-center px-4 pb-4">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 rounded-lg font-medium text-gray-600 dark:text-gray-300 text-sm"
            >
              <HiPhoto className="size-4" />
              Photo
            </Button>
            <Button
              disabled
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 rounded-lg font-medium text-gray-600 dark:text-gray-300 text-sm"
            >
              <FolderIcon className="size-4" />
              <span className="hidden md:block">Document</span>
            </Button>
            <Button
              disabled
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 rounded-lg font-medium text-gray-600 dark:text-gray-300 text-sm"
            >
              <MessagesSquareIcon className="size-4" />
              <span className="hidden md:block">Poll</span>
            </Button>
          </div>
          <Button
            disabled
            variant="ghost"
            size="sm"
            className="bg-gray-100 hover:bg-gray-200 dark:bg-black dark:hover:bg-gray-700 rounded-lg font-medium text-gray-700 dark:text-gray-300 text-sm"
          >
            <span className="hidden md:block">Post</span>
          </Button>
        </div>

        <DialogContent
          className="dark:bg-black p-0 border-gray-200 dark:border-gray-500/10 rounded-2xl max-w-2xl overflow-hidden"
          onPaste={handlePaste}
        >
          <div
            className={`relative ${isDragging ? "after:absolute after:inset-0 after:rounded-2xl after:border-2 after:border-dashed after:border-primary after:bg-primary/5" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="relative">
              <div className="px-6 py-4 border-gray-200 border-b dark:border-black">
                <DialogTitle className="font-semibold text-xl tracking-tight">
                  Create post
                </DialogTitle>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  {mounted && (
                    <Image
                      src={session?.data?.user?.image || "/user.jpg"}
                      alt="user"
                      className="shadow-sm border-2 border-gray-50 dark:border-gray-800 rounded-full size-12"
                      height={48}
                      width={48}
                      priority
                    />
                  )}
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">
                      {mounted ? session?.data?.user?.name || "User" : "User"}
                    </h4>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">
                      Public post
                    </span>
                  </div>
                </div>

                <div className="relative">
                  <AutosizeTextarea
                    maxHeight={500}
                    placeholder="What's on your mind? (500 characters max)"
                    className="bg-transparent border dark:border-gray-500/10 rounded-xl outline-none focus:outline-none focus-visible:ring-0 focus:ring-0 w-full min-h-[200px] dark:placeholder:text-gray-500 placeholder:text-gray-400 text-base"
                    value={dialogPost}
                    onChange={handleTextareaChange}
                    onSelect={(e) =>
                      setCursorPosition(e.currentTarget.selectionStart)
                    }
                    onPaste={handlePaste}
                    style={{
                      color: "inherit",
                      wordBreak: "break-word",
                    }}
                  />
                  <div className="flex justify-between items-center px-4">
                    <div className="flex items-center gap-4">
                      <div
                        className={`text-sm ${dialogPost.length > 500 ? "text-red-500" : "text-gray-500"}`}
                      >
                        {dialogPost.length}/500 characters
                      </div>
                      {errorMessage && (
                        <div className="text-red-500 text-sm">
                          {errorMessage}
                        </div>
                      )}
                    </div>
                    <div className="py-2">
                      <Popover onOpenChange={setIsOpen} open={isOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg font-medium text-gray-600 dark:text-gray-300 text-sm"
                          >
                            <SmileIcon className="w-5 h-5" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-0 w-fit">
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

                <div className="flex justify-between items-center pb-4">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2 rounded-lg font-medium text-gray-600 dark:text-gray-300 text-sm"
                      onClick={() => {
                        const input = document.createElement("input");
                        input.type = "file";
                        input.multiple = true;
                        input.accept = "image/jpeg,image/png,image/gif";
                        input.onchange = (e) => {
                          const files = Array.from(
                            (e.target as HTMLInputElement).files || [],
                          );
                          handleFiles(files);
                        };
                        input.click();
                      }}
                    >
                      <HiPhoto />
                      Photo
                    </Button>
                    <Button
                      disabled
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2 rounded-lg font-medium text-gray-600 dark:text-gray-300 text-sm"
                    >
                      <FolderIcon />
                      <span className="hidden md:block">Document</span>
                    </Button>
                    <Button
                      disabled
                      variant="ghost"
                      size="sm"
                      className="flex items-center gap-2 rounded-lg font-medium text-gray-600 dark:text-gray-300 text-sm"
                    >
                      <MessagesSquareIcon />
                      <span className="hidden md:block">Poll</span>
                    </Button>
                  </div>
                </div>

                {dialogFiles.length > 0 && (
                  <div className="flex flex-wrap items-center gap-4">
                    {dialogFiles.map(({ id, file }) => (
                      <div
                        key={id}
                        className="group relative shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-800 rounded-xl size-32 aspect-square overflow-hidden transition-all"
                      >
                        <div className="relative bg-gray-50 dark:bg-gray-800/30 w-full h-full">
                          <img
                            src={
                              URL.createObjectURL(file) || "/placeholder.svg"
                            }
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                          <Button
                            variant="secondary"
                            size="icon"
                            className="top-1 right-1 absolute bg-black/60 hover:bg-black/80 dark:bg-black/80 px-1.5 rounded-full w-fit h-6"
                            onClick={() => handleRemoveFile(id)}
                          >
                            <X className="size-6 text-white" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-6 border-gray-200 dark:border-gray-800 border-t">
                <Button
                  onClick={handleSubmit}
                  className="shadow-sm hover:shadow-md py-3 rounded-xl w-full font-medium text-sm transition-all"
                  disabled={
                    isPending ||
                    isUploading ||
                    dialogPost.trim() === "" ||
                    dialogPost.length > 500
                  }
                >
                  {isPending || isUploading ? (
                    <div className="flex justify-center items-center gap-2">
                      <div className="border-2 border-white border-t-transparent rounded-full w-4 h-4 animate-spin" />
                      {isUploading ? "Uploading..." : "Posting..."}
                    </div>
                  ) : (
                    "Post"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PostInput;
