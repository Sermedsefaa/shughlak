import createMiddleware from "next-intl/middleware";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./routing";

const intlMiddleware = createMiddleware(routing);

const locales = routing.locales;

function stripLocale(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  if (first && locales.includes(first as (typeof locales)[number])) {
    const rest = segments.slice(1).join("/");
    return rest ? `/${rest}` : "/";
  }
  return pathname;
}

function localeFromPathname(pathname: string): string {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  if (first && locales.includes(first as (typeof locales)[number])) {
    return first;
  }
  return routing.defaultLocale;
}

function pathWithLocale(locale: string, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (locale === routing.defaultLocale) return normalized;
  if (normalized === "/") return `/${locale}`;
  return `/${locale}${normalized}`;
}

export async function middleware(request: NextRequest) {
  const intlResponse = intlMiddleware(request);
  if (intlResponse.status === 307 || intlResponse.status === 308) {
    return intlResponse;
  }

  const pathname = request.nextUrl.pathname;
  const bare = stripLocale(pathname);
  const locale = localeFromPathname(pathname);

  const isProtected =
    bare === "/profile" ||
    bare.startsWith("/profile/") ||
    bare === "/dashboard" ||
    bare.startsWith("/dashboard/") ||
    bare === "/post-job" ||
    bare.startsWith("/post-job/");

  if (!isProtected) {
    return intlResponse;
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const loginPath = pathWithLocale(locale, "/auth/login");
  const loginUrl = new URL(loginPath, request.url);
  loginUrl.searchParams.set("callbackUrl", pathname);

  if (!token) {
    return NextResponse.redirect(loginUrl);
  }

  const role = token.role as string;

  if (
    (bare === "/profile" || bare.startsWith("/profile/")) &&
    role !== "SEEKER"
  ) {
    return NextResponse.redirect(
      new URL(pathWithLocale(locale, "/"), request.url)
    );
  }

  if (
    (bare === "/dashboard" ||
      bare.startsWith("/dashboard/") ||
      bare === "/post-job" ||
      bare.startsWith("/post-job/")) &&
    role !== "EMPLOYER"
  ) {
    return NextResponse.redirect(
      new URL(pathWithLocale(locale, "/"), request.url)
    );
  }

  return intlResponse;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*|favicon.ico).*)"],
};
