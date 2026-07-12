/**
 * 国际化配置 —— 5语言支持
 * 路由模式: /{locale}/... (URL-based)
 * 语言检测: middleware → cookie → Accept-Language → 默认英语
 */

export const locales = ["en", "zh", "ru", "es", "ar"] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeLabels: Record<Locale, string> = {
  en: "English",
  zh: "简体中文",
  ru: "Русский",
  es: "Español",
  ar: "العربية",
};

export const localeShorts: Record<Locale, string> = {
  en: "EN",
  zh: "中文",
  ru: "РУС",
  es: "ES",
  ar: "العربية",
};

/** RTL 语言（阿拉伯语） */
export const rtlLocales: Set<Locale> = new Set(["ar"]);

export function isRtl(locale: Locale): boolean {
  return rtlLocales.has(locale);
}

/** 从 URL 路径中提取 locale */
export function getLocaleFromPath(pathname: string): Locale | null {
  const match = pathname.match(/^\/([a-z]{2})(\/|$)/);
  if (match && locales.includes(match[1] as Locale)) {
    return match[1] as Locale;
  }
  return null;
}

/** 为指定 locale 生成路径（确保 locale 前缀） */
export function localizedPath(locale: Locale, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${clean}`;
}
