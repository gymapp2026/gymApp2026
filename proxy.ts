import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

const publicRoutes = ["/", "/login", "/register", "/forgot-password", "/reset-password"];
const adminRoutes = ["/admin"];
const superAdminRoutes = ["/admin/users"];

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  const isPublic =
    publicRoutes.some((r) => pathname === r) ||
    pathname.startsWith("/api/auth") ||
    pathname === "/api/register" ||
    pathname === "/api/forgot-password" ||
    pathname === "/api/reset-password";
  if (isPublic) return NextResponse.next();

  if (!session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const role = (session.user as any)?.role;

  if (superAdminRoutes.some((r) => pathname.startsWith(r))) {
    if (role !== "superadmin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  if (adminRoutes.some((r) => pathname.startsWith(r))) {
    if (role !== "superadmin" && role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};
