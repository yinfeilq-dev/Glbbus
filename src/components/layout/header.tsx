/**
 * 导航组件（多语言支持）
 * 语言切换通过 cookie + 页面刷新实现（无需客户端状态库）
 */

"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type Locale, locales, localeShorts, localizedPath } from "@/i18n/config";
import { useCallback } from "react";

type Props = {
  locale: Locale;
  dict: Record<string, unknown>;
};

export default function Header({ locale, dict }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  /** 切换语言：去掉旧 locale 前缀，加上新 locale */
  const switchLocale = useCallback(
    (newLocale: string) => {
      // 当前路径去掉 /{locale} 前缀
      const pathWithoutLocale = pathname.replace(/^\/[a-z]{2}(\/|$)/, "/$1");
      const newPath = `/${newLocale}${pathWithoutLocale === "/" ? "" : pathWithoutLocale}`;

      // 设置 cookie 后跳转
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=${365 * 24 * 60 * 60}; samesite=lax`;
      router.push(newPath);
    },
    [pathname, router],
  );

  // 从 dict 中安全读取 navigation
  const nav = (dict.navigation as Record<string, string>) ?? {};
  const siteName = ((dict.common as Record<string, string>)?.site_name as string) ?? "GlbBus";

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href={localizedPath(locale, "/")} className="text-xl font-bold text-blue-600">
          {siteName}
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-slate-500 md:flex">
          <Link
            href={localizedPath(locale, "/products")}
            className="font-medium text-slate-900 hover:text-blue-600"
          >
            {nav.products ?? "Products"}
          </Link>
          <Link
            href={localizedPath(locale, "/suppliers")}
            className="hover:text-blue-600"
          >
            {nav.suppliers ?? "Suppliers"}
          </Link>
          <Link
            href={localizedPath(locale, "/acceleration")}
            className="hover:text-blue-600"
          >
            {nav.acceleration ?? "Acceleration"}
          </Link>
          <Link
            href={localizedPath(locale, "/about")}
            className="hover:text-blue-600"
          >
            {nav.about ?? "About"}
          </Link>
          <Link
            href={localizedPath(locale, "/contact")}
            className="hover:text-blue-600"
          >
            {nav.contact ?? "Contact"}
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <select
            className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs text-slate-500"
            value={locale}
            onChange={(e) => switchLocale(e.target.value)}
          >
            {locales.map((l) => (
              <option key={l} value={l}>
                {localeShorts[l]}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}
