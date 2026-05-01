import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUserInfo } from "./services/auth.services";
export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;


  // Skip verify-email
  if (pathname.startsWith("/verify-email")) {
    return NextResponse.next();
  }

  // ✅ Use correct cookie name
  // const sessionToken = request.cookies.get("__Secure-better-auth.session_data");
  const sessionToken = request.cookies.get("better-auth.session_token");
  
  const userInfo = await getUserInfo()


  const role = userInfo?.role;


  // Not logged in
  if (!sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // ===============================
  // ADMIN ROUTE
  // ===============================
  if (pathname.startsWith("/admin")) {
    if (role === "MEMBER") {
      return NextResponse.redirect(
        new URL("/member/dashboard", request.url)
      );
    }


  }

  // ===============================
  // Member ROUTE
  // ===============================
  if (pathname.startsWith("/member")) {
    if (role === "ADMIN") {
      return NextResponse.redirect(
        new URL("/admin/dashboard", request.url)
      );
    }
  }

  // ===============================
  // USER ROUTE
  // ===============================
  if (pathname.startsWith("/dashboard")) {
    if (role === "ADMIN") {
      return NextResponse.redirect(
        new URL("/admin/dashboard", request.url)
      );
    }
    if (role === "MEMBER") {
      return NextResponse.redirect(
        new URL("/member/dashboard", request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/member/dashboard/:path*",
    "/dashboard/:path*",
  ],
};
