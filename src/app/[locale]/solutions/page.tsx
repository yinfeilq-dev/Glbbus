/**
 * 方案中心页面（多语言支持）
 * 展示软件解决方案 + 集成方案
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

type SolutionItem = {
  title: string;
  desc: string;
  features: string[];
  cta?: string;
  href?: string;
  tag?: string;
};

/* 软件方案图标与配色（静态类名，避免 Tailwind JIT 无法识别动态类） */
const SOFTWARE_META = [
  { icon: "🎯", chip: "bg-blue-50 text-blue-600 ring-blue-200/60" },
  { icon: "🌍", chip: "bg-violet-50 text-violet-600 ring-violet-200/60" },
  { icon: "📬", chip: "bg-emerald-50 text-emerald-600 ring-emerald-200/60" },
  { icon: "🤖", chip: "bg-amber-50 text-amber-600 ring-amber-200/60" },
  { icon: "📦", chip: "bg-cyan-50 text-cyan-600 ring-cyan-200/60" },
];

/* 企业数字化方案图标与配色 */
const ENTERPRISE_META = [
  { icon: "🗄️", chip: "bg-slate-50 text-slate-600 ring-slate-200/60" },
  { icon: "👁️", chip: "bg-cyan-50 text-cyan-600 ring-cyan-200/60" },
  { icon: "🔀", chip: "bg-orange-50 text-orange-600 ring-orange-200/60" },
  { icon: "🏭", chip: "bg-blue-50 text-blue-600 ring-blue-200/60" },
  { icon: "🧩", chip: "bg-violet-50 text-violet-600 ring-violet-200/60" },
  { icon: "🛡️", chip: "bg-emerald-50 text-emerald-600 ring-emerald-200/60" },
];

/* 集成方案图标与配色 */
const INTEGRATION_META = [
  { icon: "❄️", chip: "bg-blue-50 text-blue-600 ring-blue-200/60" },
  { icon: "🚀", chip: "bg-violet-50 text-violet-600 ring-violet-200/60" },
  { icon: "🖨️", chip: "bg-emerald-50 text-emerald-600 ring-emerald-200/60" },
  { icon: "🔧", chip: "bg-amber-50 text-amber-600 ring-amber-200/60" },
];

export default async function SolutionsPage({ params }: Props) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();

  const l = locale as Locale;
  const dict = await loadDictionary(l);
  const nav = (dict.navigation as Record<string, string>) ?? {};
  const sol = (dict.solutions as Record<string, unknown>) ?? {};
  const s = (key: string): string => (sol[key] as string) ?? "";

  const software = (sol.software as SolutionItem[]) ?? [];
  const enterprise = (sol.software_enterprise as SolutionItem[]) ?? [];
  const integration = (sol.integration as SolutionItem[]) ?? [];
  const processSteps = (sol.process_steps as string[]) ?? [];

  return (
    <>
      <Header locale={l} dict={dict} />
      <main>
        {/* ===== HERO ===== */}
        <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950">
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: "32px 32px"
          }} />
          <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px]" />
          <div className="absolute -right-32 -bottom-32 h-96 w-96 rounded-full bg-indigo-500/10 blur-[120px]" />

          <div className="relative mx-auto max-w-7xl px-4 py-20 md:py-28">
            <nav className="mb-8 text-xs text-blue-300/60">
              <Link href={localizedPath(l, "/")} className="hover:text-blue-300">
                {nav?.home ?? "Home"}
              </Link>
              <span className="mx-2">&gt;</span>
              <span className="text-blue-300/80">{s("breadcrumb")}</span>
            </nav>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white md:text-5xl">
              {s("hero_title")}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-blue-200/80">
              {s("hero_subtitle")}
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl space-y-20 px-4 py-12">
          {/* ===== 软件解决方案 ===== */}
          <section>
            <SectionLabel accent="blue" label={s("software_section")} />
            <SectionTitle text={s("software_title")} />
            <p className="-mt-4 mb-8 max-w-3xl text-sm text-slate-500">
              {s("software_desc")}
            </p>

            {/* 子分组一：跨境电商解决方案 */}
            <div className="mb-3 flex items-center gap-3">
              <div className="h-0.5 w-6 rounded-full bg-teal-400" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-teal-600">
                {s("software_group_ec")}
              </h3>
            </div>
            <div className="mb-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {software.map((item, i) => {
                const meta = SOFTWARE_META[i % SOFTWARE_META.length];
                return (
                  <div
                    key={i}
                    className="group flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
                  >
                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg text-xl ring-1 ${meta.chip}`}>
                      {meta.icon}
                    </div>
                    <h3 className="mb-2 text-base font-bold text-slate-900">{item.title}</h3>
                    <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-500">{item.desc}</p>
                    <ul className="space-y-1.5 border-t border-slate-100 pt-3">
                      {item.features.map((f, j) => (
                        <li key={j} className="flex items-start gap-2 text-xs text-slate-600">
                          <span className="mt-0.5 text-emerald-500">✔</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>

            {/* 子分组二：企业数字化解决方案 */}
            <div className="mb-3 flex items-center gap-3">
              <div className="h-0.5 w-6 rounded-full bg-cyan-400" />
              <h3 className="text-sm font-bold uppercase tracking-widest text-cyan-600">
                {s("software_group_ent")}
              </h3>
            </div>
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {enterprise.map((item, i) => {
                const meta = ENTERPRISE_META[i % ENTERPRISE_META.length];
                return (
                  <div
                    key={i}
                    className="group flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-md"
                  >
                    <div className="mb-4 flex items-center justify-between">
                      <div className={`flex h-12 w-12 items-center justify-center rounded-lg text-xl ring-1 ${meta.chip}`}>
                        {meta.icon}
                      </div>
                      {item.tag && (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
                          {item.tag}
                        </span>
                      )}
                    </div>
                    <h3 className="mb-2 text-base font-bold text-slate-900">{item.title}</h3>
                    <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-500">{item.desc}</p>
                    <ul className="space-y-1.5 border-t border-slate-100 pt-3">
                      {item.features.map((f, j) => (
                        <li key={j} className="flex items-start gap-2 text-xs text-slate-600">
                          <span className="mt-0.5 text-cyan-500">✦</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ===== 集成方案 ===== */}
          <section>
            <SectionLabel accent="violet" label={s("integration_section")} />
            <SectionTitle text={s("integration_title")} />
            <p className="-mt-4 mb-8 max-w-3xl text-sm text-slate-500">
              {s("integration_desc")}
            </p>

            <div className="grid gap-5 md:grid-cols-2">
              {integration.map((item, i) => {
                const meta = INTEGRATION_META[i % INTEGRATION_META.length];
                return (
                  <div
                    key={i}
                    className="flex flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:border-violet-200 hover:shadow-md"
                  >
                    <div className="mb-4 flex items-center gap-4">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-xl ring-1 ${meta.chip}`}>
                        {meta.icon}
                      </div>
                      <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                    </div>
                    <p className="mb-4 flex-1 text-sm leading-relaxed text-slate-500">{item.desc}</p>
                    <ul className="mb-4 space-y-1.5 border-t border-slate-100 pt-3">
                      {item.features.map((f, j) => (
                        <li key={j} className="flex items-start gap-2 text-xs text-slate-600">
                          <span className="mt-0.5 text-violet-500">▸</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    {item.cta && (
                      <Link
                        href={localizedPath(l, item.href ?? "/contact")}
                        className="inline-block w-fit rounded-lg bg-violet-600 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-violet-700"
                      >
                        {item.cta} →
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* ===== 服务流程 ===== */}
          <section className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 shadow-lg">
            <SectionLabel accent="white-blue" label={s("process_section")} />
            <h2 className="mb-8 text-2xl font-bold text-white md:text-3xl">
              {s("process_title")}
            </h2>
            <div className="grid gap-6 md:grid-cols-4">
              {processSteps.map((step, i) => (
                <div key={i} className="relative rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <span className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-blue-500/20 text-sm font-bold text-blue-300 ring-1 ring-blue-400/30">
                    {i + 1}
                  </span>
                  <p className="text-sm font-semibold text-white">{step}</p>
                  {i < processSteps.length - 1 && (
                    <span className="absolute -right-4 top-1/2 hidden -translate-y-1/2 text-slate-600 md:block">→</span>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* ===== CTA ===== */}
          <section className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-8 shadow-md">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="mb-3 text-2xl font-bold text-white">
                {s("cta_title")}
              </h2>
              <p className="mb-8 text-sm text-blue-100">
                {s("cta_desc")}
              </p>
              <Link
                href={localizedPath(l, "/contact")}
                className="inline-block rounded-lg bg-white px-8 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-50"
              >
                {nav?.contact ?? "Contact Us"} →
              </Link>
            </div>
          </section>
        </div>
      </main>
      <Footer locale={l} dict={dict} />
    </>
  );
}

/* ----- 内联小组件（避免动态 Tailwind class） ----- */

function SectionLabel({ accent, label }: { accent: string; label: string }) {
  const barColors: Record<string, string> = {
    blue: "bg-blue-500",
    violet: "bg-violet-500",
    emerald: "bg-emerald-500",
    slate: "bg-slate-500",
    "white-blue": "bg-blue-400",
  };
  const textColors: Record<string, string> = {
    blue: "text-blue-600",
    violet: "text-violet-600",
    emerald: "text-emerald-600",
    slate: "text-slate-600",
    "white-blue": "text-blue-300",
  };
  return (
    <div className="mb-2 flex items-center gap-3">
      <div className={`h-0.5 w-8 rounded-full ${barColors[accent] ?? "bg-slate-500"}`} />
      <span className={`text-xs font-semibold uppercase tracking-widest ${textColors[accent] ?? "text-slate-600"}`}>
        {label}
      </span>
    </div>
  );
}

function SectionTitle({ text }: { text: string }) {
  return (
    <h2 className="mb-8 text-2xl font-bold text-slate-900 md:text-3xl">
      {text}
    </h2>
  );
}
