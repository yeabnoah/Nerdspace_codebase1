import { z } from "zod";

const postSchema = z.object({
  content: z
    .string()
    .trim()
    .min(4, { message: "Content must be at least 4 characters long" })
    .refine((val) => val.split(/\s+/).length <= 500, {
      message: "Content cannot exceed 500 words",
    }),
  fileUrls: z.array(z.string()).optional(),
  projectId: z.string().optional(),
});

export type PostType = z.infer<typeof postSchema>;

export { postSchema };
