// import { NextRequest, NextResponse } from "next/server";
// import { getSessionCookie } from "better-auth";

// export async function middleware(request: NextRequest) {
//   const sessionCookie = getSessionCookie(request);
//   if (!sessionCookie) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }
//   return NextResponse.next();
// }

// // const
// export const config = {
//   runtime: "experimental-edge",
//   matcher: ["/dashboard"],
// };

import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;
  if (
    sessionCookie &&
    ["/login", "/signup", "/reset-password", "/forgot-password"].includes(
      pathname,
    )
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (!sessionCookie && pathname.startsWith("/")) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/profile",
    "/settings",
    "/projects",
    "/onboarding",
    "/pos",
    "/ai",
    "/community",
    "/user-profile",
    "/sandbox",
    "/whotofollow",
    "/explore",
    "/event",
    "/project",
  ],
};
