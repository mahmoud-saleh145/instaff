import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./lib/utils/token";

export async function middleware(request: NextRequest) {
  const refreshToken = request.cookies.get("refreshToken");
  const { pathname } = request.nextUrl;
  const isAuth      = pathname.startsWith("/auth");
  const isDashboard = pathname.startsWith("/dashboard");
  const isReset     = pathname.startsWith("/auth/resetPassword");
  const isRoot      = pathname === "/";

  if (isRoot) {
    return refreshToken
      ? NextResponse.redirect(new URL("/dashboard", request.url))
      : NextResponse.redirect(new URL("/auth/login", request.url));
  }
  if (!refreshToken && isDashboard)
    return NextResponse.redirect(new URL("/auth/login", request.url));
  if (refreshToken && isAuth && !isReset)
    return NextResponse.redirect(new URL("/dashboard", request.url));
  if (isReset) {
    const token = request.nextUrl.searchParams.get("resetToken");
    if (!token) return NextResponse.redirect(new URL("/auth/login", request.url));
    try { await verifyToken(token); } catch {
      return NextResponse.redirect(new URL("/auth/login", request.url));
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ["/", "/dashboard/:path*", "/auth/:path*"] };
