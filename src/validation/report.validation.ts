import { z } from "zod";

export const reportSchema = z.object({
  postId: z.string().optional(),
  commentId: z.string().optional(),
  reason: z.string(),
});

export type reportType = z.infer<typeof reportSchema>;
