import axios from "axios";

interface CreatePostData {
  content: string;
  files?: File[];
}

const createPost = async ({ content, files }: CreatePostData) => {
  const formData = new FormData();
  formData.append("content", content);

  if (files) {
    files.forEach((file) => {
      formData.append("files", file);
    });
  }

  const response = await fetch("/api/posts", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to create post");
  }

  return response.json();
};

export default createPost;
