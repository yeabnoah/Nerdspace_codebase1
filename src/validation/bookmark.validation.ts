import { z } from "zod";

const bookmarkSchema = z.object({
  userId: z.string(),
  postId: z.string(),
});

export default bookmarkSchema;
