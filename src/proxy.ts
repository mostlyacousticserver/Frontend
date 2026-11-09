import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isAdminRole } from "@/lib/roles";

const AUTH_ROUTES = ["/login", "/signup", "/verify-otp"];
const PROTECTED_PREFIXES = ["/checkout", "/admin", "/learning", "/learn"];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("token")?.value;
  const role = request.cookies.get("userRole")?.value;

  const isAuthRoute = AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );
  const isAdminRoute =
    pathname === "/admin" || pathname.startsWith("/admin/");
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (isAuthRoute && token) {
    const home = isAdminRole(role) ? "/admin" : "/learning";
    return NextResponse.redirect(new URL(home, request.url));
  }

  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (token && isAdminRole(role)) {
    const isStudentArea =
      pathname === "/learning" ||
      pathname.startsWith("/learning/") ||
      pathname === "/learn" ||
      pathname.startsWith("/learn/");
    if (isStudentArea) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  if (isAdminRoute && token && role && !isAdminRole(role)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/verify-otp",
    "/checkout/:path*",
    "/admin",
    "/admin/:path*",
    "/learning",
    "/learning/:path*",
    "/learn",
    "/learn/:path*",
  ],
};
