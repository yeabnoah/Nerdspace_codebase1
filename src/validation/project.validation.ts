import { z } from "zod";

export const projectSchema = z.object({
  name: z.string(),
  description: z.string(),
  category: z.array(z.string()),
  access: z.enum(["public", "private"]).optional(),
  status: z.enum(["ONGOING", "COMPLETED", "CANCELLED", "PAUSED"]).optional(),
});

export type ProjectInterface = z.infer<typeof projectSchema>;
