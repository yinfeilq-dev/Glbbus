/**
 * 语言路由布局
 * 负责：lang 属性、dir 方向、字典注入
 */

import { locales, isRtl, type Locale } from "@/i18n/config";
import { loadDictionary } from "@/i18n/load-dictionary";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;

  // generateMetadata 中不能 notFound，兜底
  if (!locales.includes(locale as Locale)) {
    return { title: "GlbBus" };
  }

  const dict = await loadDictionary(locale as Locale);
  const name = (dict as Record<string, unknown>).common as Record<string, string>;

  const dict2 = dict as Record<string, unknown>;
  const metaD = (dict2.meta as Record<string, string>) || {};

  return {
    title: `${name.site_name} — ${name.site_tagline}`,
    description: metaD?.home_description || name.site_tagline,
    keywords: metaD?.home_keywords || "B2B, industrial, manufacturing, sourcing",
    openGraph: {
      title: name.site_name,
      description: metaD?.home_description || name.site_tagline,
      url: `https://www.koudingcloud.com/${locale}`,
      siteName: name.site_name,
      locale: locale === "zh" ? "zh_CN" : locale === "ru" ? "ru_RU" : locale === "es" ? "es_ES" : locale === "ar" ? "ar_SA" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: name.site_name,
      description: metaD?.home_description || name.site_tagline,
    },
    alternates: {
      canonical: `https://www.koudingcloud.com/${locale}`,
      languages: {
        en: "https://www.koudingcloud.com/en",
        zh: "https://www.koudingcloud.com/zh",
        ru: "https://www.koudingcloud.com/ru",
        es: "https://www.koudingcloud.com/es",
        ar: "https://www.koudingcloud.com/ar",
      },
    },
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const l = locale as Locale;
  const dir = isRtl(l) ? "rtl" : "ltr";

  return (
    <html lang={locale} dir={dir}>
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
