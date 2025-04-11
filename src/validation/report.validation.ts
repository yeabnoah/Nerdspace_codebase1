import { z } from "zod";

export const reportSchema = z
  .object({
    postId: z.string().optional().nullable(),
    commentId: z.string().optional().nullable(),
    reason: z.string().min(1, "Reason is required"),
    additionalContext: z.string().optional().nullable(),
  })
  .refine((data) => data.postId || data.commentId, {
    message: "Either postId or commentId must be provided",
  });

export type reportType = z.infer<typeof reportSchema>;
