import { auth } from "@/auth.config";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/signin",
    "/signup",
    "/",
    "/:username/verify",
  ],
};

export async function middleware(request: NextRequest) {
  const session = await auth();
  const url = request.nextUrl;

  type UserWithVerified = {
    id: string;
    email: string;
    name?: string | null;
    verified?: boolean;
  };
  const user = session?.user as UserWithVerified | undefined;

  if (
    session &&
    user?.verified &&
    (url.pathname.startsWith("/signin") ||
      url.pathname.startsWith("/signup") ||
      url.pathname.includes("/verify") ||
      url.pathname === "/")
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  // if (!session || (!user?.verified && url.pathname.startsWith("/dashboard"))) {
  //   return NextResponse.redirect(new URL("/signin", request.url));
  // }

  if (!session && !user?.verified && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (session && !user?.verified && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }
  return NextResponse.next();
}
