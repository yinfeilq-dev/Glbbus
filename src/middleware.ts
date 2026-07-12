/**
 * i18n 中间件
 *
 * 行为：
 * 1. 根路径 / → 重定向到 /{locale}（从 cookie 或 Accept-Language 检测）
 * 2. 已有 /{locale}/... → 放行，注入 cookie
 * 3. 静态资源 /_next/static /favicon.ico 等 → 放行
 */

import { NextResponse, type NextRequest } from "next/server";
import {
  locales,
  defaultLocale,
  type Locale,
} from "./i18n/config";
import { match } from "@formatjs/intl-localematcher";
import Negotiator from "negotiator";

/** 获取用户首选语言 */
function getPreferredLocale(request: NextRequest): Locale {
  // 1. cookie 优先
  const cookieLocale = request.cookies.get("NEXT_LOCALE")?.value as
    | Locale
    | undefined;
  if (cookieLocale && locales.includes(cookieLocale)) return cookieLocale;

  // 2. Accept-Language header
  const acceptLang = request.headers.get("Accept-Language") || "";
  const negotiatorHeaders = { "accept-language": acceptLang };
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  try {
    return match(languages, [...locales], defaultLocale) as Locale;
  } catch {
    return defaultLocale;
  }
}

// 不需要 locale 前缀的路径
const PUBLIC_FILE = /\.(.*)$/;
const SKIP_LOCALE_PATHS = [
  "/_next",
  "/api",
  "/admin",
  "/favicon.ico",
  "/icon",
  "/apple-icon",
  "/manifest",
  "/sitemap",
  "/robots.txt",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 跳过静态资源和 API
  if (
    SKIP_LOCALE_PATHS.some((p) => pathname.startsWith(p)) ||
    PUBLIC_FILE.test(pathname)
  ) {
    return;
  }

  // 检查路径是否已有 locale 前缀
  const pathLocale = locales.find(
    (l) => pathname.startsWith(`/${l}/`) || pathname === `/${l}`,
  );

  if (pathLocale) {
    // 已有 locale — 刷新 cookie，放行
    const response = NextResponse.next();
    response.cookies.set("NEXT_LOCALE", pathLocale, {
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: "lax",
    });
    return response;
  }

  // 根路径 → 检测语言并重定向
  const locale = getPreferredLocale(request);
  const url = new URL(`/${locale}${pathname}`, request.url);
  url.search = request.nextUrl.search;

  const response = NextResponse.redirect(url);
  response.cookies.set("NEXT_LOCALE", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
  return response;
}

export const config = {
  // 匹配所有路径（除了 Next.js 内部路径）
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
