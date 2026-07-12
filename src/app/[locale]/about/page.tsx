/**
 * 关于我们页面（多语言支持）
 */

import { type Locale, locales, localizedPath } from "@/i18n/config";
import { loadDictionary } from "@/i18n/load-dictionary";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { notFound } from "next/navigation";
import Link from "next/link";

type Props = {
  params: Promise<{ locale: string }>;
};

export const dynamic = "force-dynamic";

export default async function AboutPage({ params }: Props) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const l = locale as Locale;
  const dict = await loadDictionary(l);
  const about = dict.about as Record<string, string>;
  const nav = dict.navigation as Record<string, string>;

  return (
    <>
      <Header locale={l} dict={dict} />
      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* 面包屑 */}
        <nav className="mb-6 text-xs text-slate-400">
          <Link href={localizedPath(l, "/")} className="hover:text-blue-600">
            {nav?.home ?? "Home"}
          </Link>
          <span className="mx-2">&gt;</span>
          <span className="text-slate-600">
            {about?.page_title ?? "About"}
          </span>
        </nav>

        {/* Hero */}
        <div className="mb-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-blue-500 px-8 py-12 text-white">
          <h1 className="mb-3 text-3xl font-bold">
            {about?.page_title ?? "About GlbBus"}
          </h1>
          <p className="max-w-2xl text-base text-indigo-100">
            {about?.description ?? ""}
          </p>
        </div>

        {/* 使命 */}
        <section className="mb-10">
          <div className="rounded-xl border border-slate-200 bg-white p-6">
            <h2 className="mb-3 text-xl font-bold text-slate-900">
              🎯 {about?.mission_title ?? "Our Mission"}
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              {about?.mission_text ?? ""}
            </p>
          </div>
        </section>

        {/* 平台定位 */}
        <section className="mb-10">
          <h2 className="mb-4 text-xl font-bold text-slate-900">
            🏗️ {about?.vision_title ?? "Platform Positioning"}
          </h2>
          <p className="text-sm leading-relaxed text-slate-600">
            {about?.vision_desc ?? ""}
          </p>
        </section>

        {/* 团队 */}
        <section className="mb-10">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="mb-3 text-xl font-bold text-slate-900">
              👥 {about?.team_title ?? "Our Team"}
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              {about?.team_text ?? ""}
            </p>
          </div>
        </section>

        {/* 为什么选择 GlbBus */}
        <section className="mb-12">
          <h2 className="mb-6 text-xl font-bold text-slate-900">
            ✅ {about?.why_title ?? "Why Choose GlbBus"}
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2, 3, 4, 5].map((i) => {
              const key = `why_${i}` as keyof typeof about;
              return (
                <div
                  key={i}
                  className="rounded-lg border border-slate-200 bg-white p-4"
                >
                  <p className="text-sm text-slate-700">{about?.[key] ?? ""}</p>
                </div>
              );
            })}
          </div>
        </section>
      </main>
      <Footer locale={l} dict={dict} />
    </>
  );
}
