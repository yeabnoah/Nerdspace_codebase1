"use client"

import usePostStore from "@/store/post.store";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { toast } from "react-hot-toast";

const PostInput = () => {
  const [post, setPost] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);  // Loading state
  const { createPost } = usePostStore();

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

  return (
    <div>
      <Textarea
        placeholder="What's on your mind?"
        className="h-14 w-full font-inter text-sm md:text-base"
        value={post}
        onChange={(e) => setPost(e.target.value)}
      />
      <Button
        onClick={handleSubmit}
        className="itemright mt-3 h-8"
        disabled={loading || post.trim() === ""}
      >
        {loading ? "Posting..." : "Post"}
      </Button>
    </div>
  );
};

export default PostInput;
