import { z } from "zod";

export const projectSchema = z.object({
  name: z.string(),
  image: z.string().url(),
  description: z.string(),
  category: z.array(z.string()),
  access: z.enum(["public", "private"]).optional(),
  status: z.enum(["ONGOING", "COMPLETED", "CANCELLED", "PAUSED"]).optional(),
});

export type ProjectInterface = z.infer<typeof projectSchema>;
