import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { magicLink } from "better-auth/plugins";
import sendEmail from "./sendEmail";
import { PrismaClient } from "@prisma/client";
import { nextCookies } from "better-auth/next-js";
import {
  passwordResetTemplate,
  emailVerificationTemplate,
  magicLinkTemplate,
} from "./emailTemplates/templates";

const prisma = new PrismaClient();
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
  },

  emailAndPassword: {
    requireEmailVerification: true,
    enabled: true,

    sendResetPassword: async ({ user, url, token }, request) => {
      await sendEmail({
        to: user.email,
        subject: "Reset Your Password | NerdSpace",
        html: passwordResetTemplate(url),
        from: "NerdSpace Security <security@nerdspace.tech>",
      });
      console.log(token, request);
    },
  },

  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      await sendEmail({
        to: user.email,
        subject: "Welcome to NerdSpace - Verify Your Email",
        html: emailVerificationTemplate(url),
        from: "NerdSpace Team <welcome@nerdspace.tech>",
      });
      console.log(token, request);
    },
  },

  plugins: [
    magicLink({
      sendMagicLink: async ({ email, token, url }, request) => {
        await sendEmail({
          to: email,
          subject: "Sign In to NerdSpace",
          html: magicLinkTemplate(url),
          from: "NerdSpace <no-reply@nerdspace.tech>",
        });
        console.log(token, request);
      },
    }),
    nextCookies(),
  ],
  advanced: {
    crossSubDomainCookies: {
      enabled: true,
      // domain: ".example.com", // Domain with a leading period
    },
    defaultCookieAttributes: {
      secure: true,
      httpOnly: true,
      sameSite: "none", // Allows CORS-based cookie sharing across subdomains
      partitioned: true, // New browser standards will mandate this for foreign cookies
    },
  },
  trustedOrigins: [
    "http://192.168.1.6:3000",
    "http://localhost:3000",
    "https://nerdspacer.com",
    "https://nerd-space-kappa.vercel.app/",
  ],
  session: {
    cookieCache: {
      enabled: true,
    },
  },
});
