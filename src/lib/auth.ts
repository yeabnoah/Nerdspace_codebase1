import { PrismaClient } from "@prisma/client";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { magicLink } from "better-auth/plugins";
import {
  emailVerificationTemplate,
  magicLinkTemplate,
  passwordResetTemplate,
} from "./emailTemplates/templates";
import sendEmail from "./sendEmail";

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
    },
    defaultCookieAttributes: {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      partitioned: true,
    },
  },
  trustedOrigins: [
    "http://localhost:3000",
    "https://1.nerdspacer.com",
    "https://nerd-space-kappa.vercel.app/",
  ],
  session: {
    cookieCache: {
      enabled: true,
    },
  },
});
