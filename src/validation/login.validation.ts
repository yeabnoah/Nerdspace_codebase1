import { z } from "zod";

const errorMessages = {
  email: {
    required: "Email is required",
  },
  password: {
    required: "Password is required",
    regex:
      "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character",
  },
};

export const loginSchema = z.object({
  email: z.string().nonempty({ message: errorMessages.email.required }),

  password: z.string().nonempty({ message: errorMessages.password.required }),
});

export type loginType = z.infer<typeof loginSchema>;
