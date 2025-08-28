// "use client" 
import { NextResponse } from "next/server";

export function middleware(req) {
  // const path = req.nextUrl.pathname;

  // Define public paths that don't require authentication
  // const isPublicPath = path === "/sign-in" || path === "/sign-up" || path === "/";

  // // Check for authentication cookies (server-side)
  // const accessToken = req.cookies.get("access_token");
  // const refreshToken = req.cookies.get("refresh_token");
  // const hasAuthCookies = accessToken || refreshToken;

  // // If the path is public and user has auth cookies, redirect to dashboard
  // if (isPublicPath && hasAuthCookies) {
  //   return NextResponse.redirect(new URL("/dashboard", req.url));
  // }

  // // If the path is protected and user doesn't have auth cookies, redirect to sign-in
  // if (!isPublicPath && !hasAuthCookies) {
  //   return NextResponse.redirect(new URL("/sign-in", req.url));
  // }

  return NextResponse.next();
}

// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      */
//     "/((?!api|_next/static|_next/image|favicon.ico).*)",
//   ],
// };
