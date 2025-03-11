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

const PostInput = () => {
  const [post, setPost] = useState<string>("");
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
      toast.error("An error occured while creating post");
    },
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
    <div className="flex items-start justify-center gap-2 rounded-xl border p-2">
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
        <Textarea
          placeholder="What's on your mind?"
          className="h-14 w-full font-inter text-sm placeholder:text-sm md:text-base"
          value={post}
          onChange={(e) => setPost(e.target.value)}
        />
        <Button
          onClick={handleSubmit}
          className="border bg-transparent my-2 text-textAlternative shadow-none hover:bg-transparent dark:text-white"
          disabled={isPending || post.trim() === ""}
        >
          {isPending ? "Posting..." : "Post"}
        </Button>
      </div>
    </div>
  );
};

export default PostInput;
