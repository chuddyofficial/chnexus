import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/constants";

/**
 * Defense-in-depth: reject requests to protected routes with no session
 * cookie at all before they reach the app. This does not replace the real
 * session/expiry check in getCurrentAdmin() (a stale or forged cookie value
 * still needs DB verification) — it only short-circuits the obvious case.
 */
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtectedPage =
    pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isProtectedApi =
    pathname.startsWith("/api/admin") &&
    pathname !== "/api/admin/login" &&
    pathname !== "/api/admin/verify-mfa";

  if (isProtectedPage || isProtectedApi) {
    const hasSession = req.cookies.has(SESSION_COOKIE);
    if (!hasSession) {
      if (isProtectedApi) {
        return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
      }
      const loginUrl = new URL("/admin/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
