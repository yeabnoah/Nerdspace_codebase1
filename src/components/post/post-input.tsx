"use client";

import usePostStore from "@/store/post.store";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { toast } from "react-hot-toast";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { useRouter } from "next/navigation";

const PostInput = () => {
  const [post, setPost] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { createPost } = usePostStore();
  const session = authClient.useSession();
  const router = useRouter()

  const handleSubmit = async () => {
    if (post.trim() === "") {
      toast.error("Post content cannot be empty.");
      return;
    }

    setLoading(true);

    try {
      await createPost(post);
      setPost("");
    } catch (error) {
      toast.error("Error creating post. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if(!session){
    router.push("/login")
  }

  return (
    <div className="flex gap-2 justify-center items-start rounded-xl border  p-2">
      <div>
        <Image
          src={session?.data?.user?.image || "/user.jpg"}
          alt="user"
          className="size-8 rounded-full"
          height={200}
          width={200}
        />
      </div>

      <div className=" flex-1 flex flex-col items-end">
        <Textarea
          placeholder="What's on your mind?"
          className="h-14 w-full font-inter bg-black/10 placeholder:text-sm text-sm md:text-base"
          value={post}
          onChange={(e) => setPost(e.target.value)}
        />
        <Button
        // variant="outline"
          onClick={handleSubmit}
          className="mt-3 h-8 bg-transparent border text-black/50  dark:text-white border-white/50 hover:bg-transparent" 
          disabled={loading || post.trim() === ""}
        >
          {loading ? "Posting..." : "Post"}
        </Button>
      </div>
    </div>
  );
};

export default PostInput;
