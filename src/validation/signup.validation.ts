import { z } from "zod";

const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&\-])[A-Za-z\d@$!%*?&\-]{8,}$/;

const errorMessages = {
  name: {
    required: "Name is required",
    min: "Name must be at least 2 characters long",
  },
  email: {
    required: "Email is required",
    invalid: "Please enter a valid email address",
  },
  password: {
    required: "Password is required",
    regex:
      "Password must be at least 8 characters long, include at least one uppercase letter, one lowercase letter, one number, and one special character",
  },
};

export const signupSchema = z.object({
  name: z
    .string()
    .min(2, { message: errorMessages.name.min })
    .nonempty({ message: errorMessages.name.required }),

  email: z
    .string()
    .email({ message: errorMessages.email.invalid })
    .nonempty({ message: errorMessages.email.required }),

  password: z
    .string()
    .nonempty({ message: errorMessages.password.required })
    .regex(strongPasswordRegex, { message: errorMessages.password.regex }),
});

export type SignupFormData = z.infer<typeof signupSchema>;
