import { z } from "zod";

const errorMessages = {
  email: {
    required: "Email is required",
    invalid: "Please enter a valid email address",
  },
};

export const ForgotPasswordSchema = z.object({
  email: z
    .string()
    .email({ message: errorMessages.email.invalid })
    .nonempty({ message: errorMessages.email.required }),
});

export type ForgotPasswordType = z.infer<typeof ForgotPasswordSchema>;
