import { auth } from "@/auth.config";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/dashboard/:path*", "/signin", "/signup", "/", "/verify/:path*"],
};

export async function middleware(request: NextRequest) {
  const session = await auth();
  const url = request.nextUrl;

  if (
    session &&
    (url.pathname.startsWith("/signin") ||
      url.pathname.startsWith("/signup") ||
      url.pathname.startsWith("/verify") ||
      url.pathname === "/")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (!session && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  return NextResponse.next();
}
