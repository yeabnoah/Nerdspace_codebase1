import { z } from "zod";

const CountrySchema = z.object({
  alpha2: z.string().length(2),
  alpha3: z.string().length(3),
  countryCallingCodes: z.array(z.string()),
  currencies: z.array(z.string()),
  emoji: z.string().optional(),
  ioc: z.string(),
  languages: z.array(z.string()),
  name: z.string(),
  status: z.string(),
});

export const OnboardingSchema = z.object({
  country: CountrySchema.optional(),
  bio: z.string().optional(),
  displayName: z.string().optional(),
  nerdAt: z.string().optional(),
  image: z.string().url().optional(),
  firstTime: z.boolean(),
  link: z.string().url().optional(),
  coverImage: z.string().url().optional(),
});

export type OnboardingType = z.infer<typeof OnboardingSchema>;
