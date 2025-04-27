import { z } from "zod";

const likeSchema = z.object({
  postId: z.string(),
});

export default likeSchema;
