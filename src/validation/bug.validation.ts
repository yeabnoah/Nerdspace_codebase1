import { z } from "zod";

export const bugReportSchema = z.object({
  content: z.string().min(1, "Content is required"),
  bugseverity: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  status: z.enum(["PENDING", "RESOLVED", "REJECTED"]).optional(),
});
