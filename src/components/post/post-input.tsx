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

const cloudinaryUploadUrl = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_URL!;
const cloudinaryUploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;

const PostInput = () => {
  
  const [post, setPost] = useState<string>("");
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const session = authClient.useSession();
  const router = useRouter();

  const { mutate, isPending, isError } = useMutation({
    mutationKey: ["create-post"],
    mutationFn: createPost,
    onSuccess: () => {
      toast.success("Post created successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      //mutation.ts
    },
    onError: () => {
      toast.error("An error occurred while creating post");
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);

      setSelectedImage(file);
    }
  };

  const handleSubmit = async () => {
    if (post.trim() === "") {
      toast.error("Post content cannot be empty.");
      return;
    }

    try {
      // Upload files to Cloudinary and get URLs
      const fileUrls = await Promise.all(
        files.map(async (file) => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", cloudinaryUploadPreset); 

          const response = await axios.post(cloudinaryUploadUrl, formData);

          return response.data.secure_url;
        })
      );

      mutate({ content: post, fileUrls });
      setPost("");
      setFiles([]);
    } catch (error) {
      toast.error("An error occurred while uploading files");
    }
  };

  if (!session) {
    router.push("/login");
  }

  return (
    <div className="flex items-start justify-center gap-2 dark:border-gray-500/5 rounded-xl border-gray-100 dark:border-textAlternative border p-2">
      <div>
        <Image
          src={session?.data?.user?.image || "/user.jpg"}
          alt="user"
          className="size-8 rounded-full"
          height={200}
          width={200}
        />
      </div>

      <div className="flex flex-1 flex-col items-end">
        <AutosizeTextarea
          maxHeight={300}
          placeholder="What's on your mind?"
          className="h-14 w-full font-inter border-gray-100 dark:border-gray-500/5 bg-transparent text-sm placeholder:text-sm md:text-base"
          value={post}
          onChange={(e) => setPost(e.target.value)}
        />
        <PostFileUploader onFilesSelected={setFiles} />
        <Button
          onClick={handleSubmit}
          className="my-2 border bg-transparent text-textAlternative shadow-none hover:bg-transparent dark:text-white"
          disabled={isPending || post.trim() === ""}
        >
          {isPending ? "Posting..." : "Post"}
        </Button>
      </div>
    </div>
  );
};

export default PostInput;
