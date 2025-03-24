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
      setIsDialogOpen(false); // Close the dialog after posting
    } catch (error) {
      toast.error("An error occurred while uploading files");
    }
  };

  if (!session) {
    router.push("/login");
  }

  return (
    <div className="flex items-start justify-center gap-2 rounded-xl border border-gray-100 p-2 dark:border-gray-500/5 dark:border-textAlternative">
      <div>
        <Image
          src={session?.data?.user?.image || "/user.jpg"}
          alt="user"
          className="size-8 rounded-full"
          height={200}
          width={200}
        />
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div className="flex flex-1 flex-col items-end">
            <AutosizeTextarea
              maxHeight={300}
              placeholder="What's on your mind?"
              className="h-14 w-full border-gray-100 bg-transparent font-inter text-sm placeholder:text-sm dark:border-gray-500/5 md:text-base"
              value=""
              readOnly
            />
            {/* <PostFileUploader onFilesSelected={() => {}} /> */}
            <Button
              onClick={() => {}}
              className="my-2 border bg-transparent text-textAlternative shadow-none hover:bg-transparent dark:text-white"
              disabled
            >
              Post
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent className="bg-textAlternative">
          <DialogTitle>Create a new post</DialogTitle>
          <DialogDescription>
            Share your thoughts or upload an image.
          </DialogDescription>
          <AutosizeTextarea
            maxHeight={300}
            placeholder="What's on your mind?"
            className="h-14 w-full border-gray-100 bg-transparent font-inter text-sm placeholder:text-sm dark:border-gray-500/5 md:text-base"
            value={dialogPost}
            onChange={(e) => setDialogPost(e.target.value)}
          />
          <PostFileUploader onFilesSelected={setDialogFiles} />
          {dialogFiles.length > 0 && (
            <div className="mt-2 grid grid-cols-2 gap-2">
              {dialogFiles.map((file) => (
                <div
                  key={file.name}
                  className="group relative h-36 overflow-hidden rounded-lg border"
                >
                  <div className="relative aspect-square bg-gray-100">
                    <img
                      src={URL.createObjectURL(file)}
                      alt={file.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute right-2 top-2 flex gap-1">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-7 w-7"
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
          <div className="flex items-center gap-2">
            <Button
              onClick={handleSubmit}
              className="my-2 flex-1 border bg-transparent text-textAlternative shadow-none hover:bg-transparent dark:text-white"
              disabled={isPending || dialogPost.trim() === ""}
            >
              {isPending ? "Posting..." : "Post"}
            </Button>
            <DialogClose asChild className="flex-1">
              <Button className="mt-2">Close</Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PostInput;
