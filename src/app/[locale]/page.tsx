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
            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href={localizedPath(l, "/products")}
                className="rounded-lg bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-amber-300 transition"
              >
                🛒 {t(dict, "navigation.products") || "Browse Products"}
              </Link>
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

        {/* CDU 液冷集成服务专区 */}
        <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 py-20">
          <div className="mx-auto max-w-7xl px-4">
            <div className="mb-10 text-center">
              <span className="inline-block rounded-full bg-amber-400 px-4 py-1 text-xs font-bold tracking-wide text-slate-900">
                ⭐ {t(dict, "home.cdu.badge")}
              </span>
              <h2 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
                {t(dict, "home.cdu.title")}
              </h2>
              <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
                {t(dict, "home.cdu.subtitle")}
              </p>
            </div>

            <div className="grid items-center gap-8 lg:grid-cols-2">
              {/* 流程图 */}
              <div className="overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/products/cdu-flow.png"
                  alt="Liquid cooling manifold integration workflow"
                  className="w-full"
                  loading="lazy"
                />
              </div>

              {/* 卖点列表 + CTA */}
              <div>
                <ul className="space-y-3">
                  {((dict as Record<string, Record<string, Record<string, string[]>>>).home.cdu.points as string[]).map((point, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
                    >
                      <span className="mt-0.5 text-emerald-400">✔</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <Link
                    href={localizedPath(l, "/products/KD-CDU-INTEGRATION")}
                    className="rounded-lg bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-900 hover:bg-amber-300 transition"
                  >
                    {t(dict, "home.cdu.cta")} →
                  </Link>
                  <Link
                    href={localizedPath(l, "/products")}
                    className="text-sm font-medium text-blue-300 hover:text-blue-200"
                  >
                    {t(dict, "home.cdu.cta_sub")} →
                  </Link>
                </div>
              </div>
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
