import { z } from "zod";

export const projectSchema = z.object({
  name: z.string(),
  description: z.string(),
  category: z.string(),
});

export type ProjectInterface = z.infer<typeof projectSchema>;
