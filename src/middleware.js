"use client"
import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("access_token");
  if (!token && req.nextUrl.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/pages/:path*"],
};
