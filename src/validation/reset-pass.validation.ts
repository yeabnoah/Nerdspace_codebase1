import { z } from "zod";

const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const errorMessages = {
  password: {
    required: "Password is required",
    regex:
      "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character",
  },
  confirmPassword: {
    required: "Confirm Password is required",
    match: "Passwords do not match",
  },
};

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .nonempty({ message: errorMessages.password.required })
      .regex(strongPasswordRegex, { message: errorMessages.password.regex }),
    confirmPassword: z
      .string()
      .nonempty({ message: errorMessages.confirmPassword.required }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: errorMessages.confirmPassword.match,
    path: ["confirmPassword"],
  });

export type resetPasswordType = z.infer<typeof resetPasswordSchema>;
