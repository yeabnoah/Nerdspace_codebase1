"use client";

import usePostStore from "@/store/post.store";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { toast } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { queryClient } from "@/providers/tanstack-query-provider";
import createPost from "@/functions/create-post";

const PostInput = () => {
  const [post, setPost] = useState<string>("");
  const session = authClient.useSession();
  const router = useRouter();

  const { mutate, isPending, isError } = useMutation({
    mutationKey: ["create-post"],
    mutationFn: createPost,
    onSuccess : () => {
     toast.success("Post created successfully");
     queryClient.invalidateQueries({queryKey : ["posts"]});
    },
    onError : () => {
      toast.error("An error occured while creating post");
    }
  });

  const handleSubmit = async () => {
    if (post.trim() === "") {
      toast.error("Post content cannot be empty.");
      return;
    }

    mutate({ content: post });
  };

  if (!session) {
    router.push("/login");
  }

  return (
    <div className="flex gap-2 justify-center items-start rounded-xl border p-2">
      <div>
        <Image
          src={session?.data?.user?.image || "/user.jpg"}
          alt="user"
          className="size-8 rounded-full"
          height={200}
          width={200}
        />
      </div>

      <div className="flex-1 flex flex-col items-end">
        <Textarea
          placeholder="What's on your mind?"
          className="h-14 w-full font-inter bg-black/10 placeholder:text-sm text-sm md:text-base"
          value={post}
          onChange={(e) => setPost(e.target.value)}
        />
        <Button
          onClick={handleSubmit}
          className="mt-3 h-8 bg-transparent border text-black/50 dark:text-white border-white/50 hover:bg-transparent"
          disabled={isPending || post.trim() === ""}
        >
          {isPending ? "Posting..." : "Post"}
        </Button>
      </div>
    </div>
  );
};

export default PostInput;
