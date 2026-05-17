import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  getNewTokensWithRefreshToken,
  getUserInfo,
} from "./services/auth.services";
import { jwtUtils } from "./lib/jwtUtils";
import { isTokenExpiringSoon } from "./lib/tokenUtils";

async function refreshTokenMiddleware(refreshToken: string): Promise<boolean> {
  try {
    const refresh = await getNewTokensWithRefreshToken(refreshToken);
    if (!refresh) {
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error refreshing token in middleware:", error);
    return false;
  }
}

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip verify-email
  if (pathname.startsWith("/verify-email")) {
    return NextResponse.next();
  }

  // ✅ Use correct cookie name
  // const sessionToken = request.cookies.get("__Secure-better-auth.session_data");
  const sessionToken = request.cookies.get("better-auth.session_token");

  const userInfo = await getUserInfo();
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;
  const isValidAccessToken =accessToken && jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string).success;

  const role = userInfo?.role;

  // Not logged in
  if (!sessionToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }



      //proactively refresh token if refresh token exists and access token is expired or about to expire
  if (
      isValidAccessToken &&
      refreshToken &&
      (await isTokenExpiringSoon(accessToken))
    ) {
      const requestHeaders = new Headers(request.headers);

      const response = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });

      try {
        const refreshed = await refreshTokenMiddleware(refreshToken);

        if (refreshed) {
          requestHeaders.set("x-token-refreshed", "1");
        }

        return NextResponse.next({
          request: {
            headers: requestHeaders,
          },
          headers: response.headers,
        });
      } catch (error) {
        console.error("Error refreshing token:", error);
      }

      return response;
    }









  // ===============================
  // ADMIN ROUTE
  // ===============================
  if (pathname.startsWith("/admin")) {
    if (role === "MEMBER") {
      return NextResponse.redirect(new URL("/member/dashboard", request.url));
    }
  }

  // ===============================
  // Member ROUTE
  // ===============================
  if (pathname.startsWith("/member")) {
    if (role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
  }

  // ===============================
  // USER ROUTE
  // ===============================
  if (pathname.startsWith("/dashboard")) {
    if (role === "ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    if (role === "MEMBER") {
      return NextResponse.redirect(new URL("/member/dashboard", request.url));
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
