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

const PostInput = () => {
  const [post, setPost] = useState<string>("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const session = authClient.useSession();
  const router = useRouter();

  const { mutate, isPending, isError } = useMutation({
    mutationKey: ["create-post"],
    mutationFn: createPost,
    onSuccess: () => {
      toast.success("Post created successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      setPost("");
      setSelectedFiles([]);
    },
    onError: () => {
      toast.error("An error occurred while creating post");
    },
  });

  const handleSubmit = async () => {
    if (post.trim() === "") {
      toast.error("Post content cannot be empty.");
      return;
    }

    mutate({ content: post, files: selectedFiles });
  };

  if (!session) {
    router.push("/login");
  }

  return (
    <div className="flex items-start justify-center gap-2 rounded-xl border p-4">
      <div>
        <Image
          src={session?.data?.user?.image || "/user.jpg"}
          alt="user"
          className="size-8 rounded-full"
          height={40}
          width={40}
        />
      </div>

      <div className="flex flex-1 flex-col items-end">
        <AutosizeTextarea
          maxHeight={300}
          placeholder="What's on your mind?"
          className="h-14 w-full font-inter bg-transparent text-sm placeholder:text-sm md:text-base"
          value={post}
          onChange={(e) => setPost(e.target.value)}
        />
        <PostFileUploader
          onFilesSelected={(files) => setSelectedFiles(files)}
        />
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
