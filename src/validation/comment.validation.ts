import { z } from "zod";

const commentSchema = z.object({
  postId: z.string(),
  content: z.string(),
  parentId: z.string().optional(),
});

export default commentSchema;
