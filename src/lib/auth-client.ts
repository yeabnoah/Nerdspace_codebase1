import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // baseURL: "http://localhost:3000", // the base url of your auth server
  baseURL: "https://nerdspacer.com",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  },
});

export const { signIn, signUp, useSession } = createAuthClient();
