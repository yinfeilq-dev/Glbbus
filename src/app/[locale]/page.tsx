/**
 * 首页 —— 营销落地页（多语言支持）
 * 简洁版：只展示 GlbBus 平台定位 + 网络加速服务
 */

import { type Locale, locales } from "@/i18n/config";
import { loadDictionary, t } from "@/i18n/load-dictionary";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { notFound } from "next/navigation";
import Link from "next/link";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const l = locale as Locale;
  const dict = await loadDictionary(l);

  return (
    <>
      <Header locale={l} dict={dict} />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-700 to-violet-600 text-white">
          <div className="mx-auto max-w-7xl px-4 py-24">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {t(dict, "home.hero_title")}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-white/75">
              {t(dict, "home.hero_subtitle")}
            </p>
            <div className="mt-10 flex gap-4">
              <Link
                href={localizedPath(l, "/acceleration")}
                className="rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50 transition"
              >
                {t(dict, "common.cta_acceleration_button")}
              </Link>
              <Link
                href={localizedPath(l, "/contact")}
                className="rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition"
              >
                {t(dict, "navigation.contact")}
              </Link>
            </div>
          </div>
        </section>

        {/* 平台定位 */}
        <section className="mx-auto max-w-7xl px-4 py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold text-slate-900">
              {t(dict, "about.mission_title")}
            </h2>
            <p className="mt-4 text-base text-slate-500 leading-relaxed">
              {t(dict, "about.mission_text")}
            </p>
          </div>
        </section>

        {/* 核心优势 */}
        <section className="bg-slate-50 py-16">
          <div className="mx-auto max-w-7xl px-4">
            <h2 className="mb-10 text-center text-2xl font-bold text-slate-900">
              {t(dict, "about.why_title")}
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                { icon: "🌐", title: t(dict, "about.why_1") },
                { icon: "🤖", title: t(dict, "about.why_2") },
                { icon: "📋", title: t(dict, "about.why_3") },
                { icon: "🌍", title: t(dict, "about.why_4") },
                { icon: "✅", title: t(dict, "about.why_5") },
              ].map((item, i) => (
                <div key={i} className="rounded-xl border border-slate-200 bg-white p-5">
                  <div className="text-2xl">{item.icon}</div>
                  <div className="mt-2 text-sm font-medium text-slate-900">{item.title}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 信任条 */}
        <section className="mx-auto max-w-7xl px-4 py-10">
          <div className="flex flex-wrap justify-center gap-8 rounded-xl border border-slate-200 py-6">
            {[
              { icon: "✅", label: t(dict, "common.factory_verified") },
              { icon: "📋", label: t(dict, "common.on_time_delivery") },
              { icon: "🌍", label: t(dict, "common.global_shipping") },
              { icon: "🤖", label: t(dict, "common.ai_match") },
              { icon: "🔒", label: t(dict, "common.secure_payments") },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="text-xl">{item.icon}</div>
                <div className="mt-1 text-xs text-slate-400">{item.label}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer locale={l} dict={dict} />
    </>
  );
}

function localizedPath(locale: string, path: string): string {
  return `/${locale}${path}`;
}
