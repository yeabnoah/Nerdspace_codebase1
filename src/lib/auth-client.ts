import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  },

  fetchOptions: {
    credentials: "include",
  },
});

export const { signIn, signUp, useSession } = createAuthClient();
