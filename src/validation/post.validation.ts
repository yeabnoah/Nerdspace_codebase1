import { z } from "zod";

const postSchema = z.object({
  content: z
    .string()
    .min(4, { message: "Content must be at least 4 characters long" })
    .max(500, { message: "Content cannot exceed 500 characters" })
    .trim(),
});

export { postSchema };
