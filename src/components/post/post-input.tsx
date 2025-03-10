"use client"

import usePostStore from "@/store/post.store";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

const PostInput = () => {
  const [post, setPost] = useState<string>("");
  const { fetchPosts } = usePostStore();
  
  return (
    <div>
      <Textarea
        placeholder=" what's on your mind ?"
        className="h-14 w-full font-inter text-sm md:text-base"
        value={post}
        onChange={(e) => {
          setPost(e.target.value);
        }}
      />
      <Button onClick={fetchPosts} className="itemright mt-3 h-8">
        Post
      </Button>
    </div>
  );
};

export default PostInput;
