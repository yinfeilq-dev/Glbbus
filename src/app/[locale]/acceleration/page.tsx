/**
 * 跨境网络加速服务页面（多语言支持）
 * v2: 增强视觉层次、色块分段、品牌感
 */

import { type Locale, locales, localizedPath } from "@/i18n/config";
import { loadDictionary } from "@/i18n/load-dictionary";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import InquiryForm from "@/components/product/inquiry-form";
import { notFound } from "next/navigation";
import Link from "next/link";

type Props = {
  params: Promise<{ locale: string }>;
};

export const dynamic = "force-dynamic";

const PRICING = {
  japan: {
    label: "route_japan",
    tiers: [
      { bw: "10M", price: 1100, ipv4: 4, ipv6: "/64" },
      { bw: "20M", price: 2200, ipv4: 4, ipv6: "/64" },
      { bw: "30M", price: 3300, ipv4: 4, ipv6: "/64" },
      { bw: "50M", price: 5500, ipv4: 4, ipv6: "/64" },
      { bw: "100M", price: 11000, ipv4: 8, ipv6: "/56" },
      { bw: "200M", price: 22000, ipv4: 8, ipv6: "/56" },
      { bw: "300M", price: 33000, ipv4: 8, ipv6: "/56" },
      { bw: "500M", price: 55000, ipv4: 8, ipv6: "/56" },
      { bw: "1G", price: 110000, ipv4: 64, ipv6: "/48" },
      { bw: "2G", price: 220000, ipv4: 64, ipv6: "/48" },
      { bw: "3G", price: 330000, ipv4: 64, ipv6: "/48" },
      { bw: "5G", price: 550000, ipv4: 64, ipv6: "/48" },
      { bw: "10G", price: 1100000, ipv4: 128, ipv6: "/48" },
    ],
  },
  usa: {
    label: "route_usa",
    tiers: [
      { bw: "10M", price: 1400, ipv4: 4, ipv6: "/64" },
      { bw: "20M", price: 2800, ipv4: 4, ipv6: "/64" },
      { bw: "30M", price: 4200, ipv4: 4, ipv6: "/64" },
      { bw: "50M", price: 7000, ipv4: 4, ipv6: "/64" },
      { bw: "100M", price: 14000, ipv4: 8, ipv6: "/56" },
      { bw: "200M", price: 28000, ipv4: 8, ipv6: "/56" },
      { bw: "300M", price: 42000, ipv4: 8, ipv6: "/56" },
      { bw: "500M", price: 70000, ipv4: 8, ipv6: "/56" },
      { bw: "1G", price: 140000, ipv4: 64, ipv6: "/48" },
      { bw: "2G", price: 280000, ipv4: 64, ipv6: "/48" },
      { bw: "3G", price: 420000, ipv4: 64, ipv6: "/48" },
      { bw: "5G", price: 700000, ipv4: 64, ipv6: "/48" },
      { bw: "10G", price: 1400000, ipv4: 128, ipv6: "/48" },
    ],
  },
  europe: {
    label: "route_europe",
    tiers: [
      { bw: "10M", price: 2000, ipv4: 4, ipv6: "/64" },
      { bw: "20M", price: 4000, ipv4: 4, ipv6: "/64" },
      { bw: "30M", price: 6000, ipv4: 4, ipv6: "/64" },
      { bw: "50M", price: 10000, ipv4: 4, ipv6: "/64" },
      { bw: "100M", price: 20000, ipv4: 8, ipv6: "/56" },
      { bw: "200M", price: 40000, ipv4: 8, ipv6: "/56" },
      { bw: "300M", price: 60000, ipv4: 8, ipv6: "/56" },
      { bw: "500M", price: 100000, ipv4: 8, ipv6: "/56" },
      { bw: "1G", price: 200000, ipv4: 64, ipv6: "/48" },
      { bw: "2G", price: 400000, ipv4: 64, ipv6: "/48" },
      { bw: "3G", price: 600000, ipv4: 64, ipv6: "/48" },
      { bw: "5G", price: 1000000, ipv4: 64, ipv6: "/48" },
      { bw: "10G", price: 2000000, ipv4: 128, ipv6: "/48" },
    ],
  },
};

const PARTNERS = [
  { name: "中国电信" }, { name: "中国移动" }, { name: "中国联通" },
  { name: "东方有线" }, { name: "长城宽带" }, { name: "腾讯" },
  { name: "阿里巴巴" }, { name: "华为" }, { name: "有孚网络" },
  { name: "万国数据" }, { name: "世纪互联" }, { name: "EVERSEC" },
  { name: "上海科技网" }, { name: "商汤" }, { name: "上海工创中心" },
  { name: "速宝科技" },
];

function fmtPrice(n: number): string {
  return `¥${n.toLocaleString("zh-CN")}/mo`;
}

export default async function AccelerationPage({ params }: Props) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) notFound();

  const l = locale as Locale;
  const dict = await loadDictionary(l);
  const acc = dict.acceleration as Record<string, string>;
  const nav = dict.navigation as Record<string, string>;

  return (
    <>
      <Header locale={l} dict={dict} />
      <main>
        {/* ===== HERO — 全宽深色渐变 ===== */}
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
              <span className="text-blue-300/80">{acc?.breadcrumb_acceleration ?? ""}</span>
            </nav>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-white md:text-5xl">
              {acc?.hero_title ?? ""}
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-blue-200/80">
              {acc?.hero_subtitle ?? ""}
            </p>
          </div>
        </div>

        <div className="mx-auto max-w-7xl space-y-20 px-4 py-12">
          {/* ===== SHIXP 介绍 ===== */}
          <section>
            <SectionLabel accent="blue" label={acc?.overview_section ?? "About"} />
            <SectionTitle text={acc?.overview_title ?? ""} />
            <div className="relative overflow-hidden rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 shadow-sm">
              <p className="mb-6 text-base italic text-blue-600">
                &ldquo;{acc?.overview_slogan ?? ""}&rdquo;
              </p>
              <p className="leading-relaxed text-slate-700">
                {acc?.overview_desc ?? ""}
              </p>
            </div>
          </section>

          {/* ===== 核心价值量化 ===== */}
          <section>
            <SectionLabel accent="emerald" label="Value" />
            <SectionTitle text={acc?.value_title ?? ""} />
            <div className="grid gap-5 md:grid-cols-4">
              {[
                { icon: "💰", label: acc?.value_cost ?? "", color: "emerald" },
                { icon: "⚡", label: acc?.value_latency ?? "", color: "blue" },
                { icon: "🔗", label: acc?.value_simplify ?? "", color: "violet" },
                { icon: "🛡️", label: acc?.value_compliance ?? "", color: "amber" },
              ].map((v) => (
                <div key={v.color} className="group rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                  <div className={`mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-${v.color}-50 text-xl ring-1 ring-${v.color}-200/50`}>
                    {v.icon}
                  </div>
                  <p className={`text-sm font-semibold text-${v.color}-800`}>
                    {v.label}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* ===== 产品体系 ===== */}
          <section>
            <SectionLabel accent="violet" label="Solutions" />
            <SectionTitle text={acc?.product_lines_title ?? ""} />

            <div className="mb-8">
              <h3 className="mb-1 text-lg font-bold text-slate-800">
                {acc?.pl_basic_title ?? ""}
              </h3>
              <p className="mb-5 text-sm text-slate-500">{acc?.pl_basic_intro ?? ""}</p>
              <div className="grid gap-4 md:grid-cols-2">
                {[
                  ["🔗", acc?.pl_interconnect ?? ""],
                  ["🌐", acc?.pl_transit ?? ""],
                  ["☁️", acc?.pl_multicloud ?? ""],
                  ["🔒", acc?.pl_dedicated ?? ""],
                ].map(([icon, text], i) => (
                  <div key={i} className="flex gap-4 rounded-lg border border-slate-200 bg-white p-5 transition-colors hover:border-blue-200 hover:bg-blue-50/30">
                    <span className="mt-0.5 shrink-0 text-xl">{icon}</span>
                    <p className="text-sm text-slate-700">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {[
                ["🚀", acc?.pl_international ?? "", "blue"],
                ["⚙️", acc?.pl_compute ?? "", "violet"],
                ["🛡️", acc?.pl_security ?? "", "slate"],
              ].map(([icon, text, color]) => (
                <div key={color} className="flex gap-4 rounded-lg border border-slate-100 bg-gradient-to-br from-white to-slate-50/40 p-5">
                  <span className="mt-0.5 shrink-0 text-xl">{icon}</span>
                  <p className="text-sm text-slate-700">{text}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ===== 互联生态 ===== */}
          <section className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 shadow-lg">
            <SectionLabel accent="white-blue" label="Ecosystem" />
            <h2 className="mb-2 text-2xl font-bold text-white md:text-3xl">
              {acc?.ecosystem_title ?? ""}
            </h2>
            <p className="mb-6 max-w-3xl text-sm text-slate-300">
              {acc?.ecosystem_subtitle ?? ""}
            </p>
            <div className="flex flex-wrap gap-2">
              {PARTNERS.map((p) => (
                <span
                  key={p.name}
                  className="rounded-full border border-slate-600 bg-slate-700/50 px-3.5 py-1.5 text-sm text-slate-200 backdrop-blur-sm transition-colors hover:border-blue-500/50 hover:bg-blue-900/30 hover:text-white"
                >
                  {p.name}
                </span>
              ))}
            </div>
          </section>

          {/* ===== 国际加速说明 ===== */}
          <section>
            <SectionLabel accent="blue" label="Service" />
            <SectionTitle text={acc?.product_name ?? ""} />
            <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-6">
              <p className="max-w-4xl leading-relaxed text-slate-700">
                {acc?.product_desc ?? ""}
              </p>
            </div>
          </section>

          {/* ===== 核心优势 ===== */}
          <section className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-8 shadow-md">
            <SectionLabel accent="white-blue" label="Features" />
            <h2 className="mb-8 text-2xl font-bold text-white md:text-3xl">
              {acc?.features_title ?? ""}
            </h2>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                ["🌐", acc?.feature_coverage ?? "", acc?.feature_coverage_desc ?? ""],
                ["⚡", acc?.feature_quality ?? "", acc?.feature_quality_desc ?? ""],
                ["📶", acc?.feature_bandwidth ?? "", acc?.feature_bandwidth_desc ?? ""],
              ].map(([icon, title, desc], i) => (
                <div key={i} className="rounded-xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm transition-all hover:bg-white/20">
                  <div className="mb-3 text-2xl">{icon}</div>
                  <h3 className="mb-2 font-semibold text-white">{title}</h3>
                  <p className="text-sm text-blue-100">{desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ===== 数字出海平台 ===== */}
          <section>
            <SectionLabel accent="emerald" label="Platform" />
            <SectionTitle text={acc?.digital_platform_section ?? ""} />
            <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 p-8">
              <p className="mb-6 leading-relaxed text-slate-700">
                {acc?.digital_platform_intro ?? ""}
              </p>
              <div className="grid gap-4 md:grid-cols-2">
                {[1, 2, 3, 4].map((i) => {
                  const key = `digital_feature_${i}`;
                  return (
                    <div key={i} className="flex items-start gap-3 rounded-lg border border-emerald-100 bg-white p-4">
                      <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
                        {i}
                      </span>
                      <span className="text-sm text-slate-700">
                        {acc?.[key as keyof typeof acc] ?? ""}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* ===== 目标客户 ===== */}
          <section className="rounded-2xl bg-gradient-to-br from-violet-50 to-fuchsia-50 p-8">
            <SectionLabel accent="violet" label="Use Cases" />
            <SectionTitle text={acc?.use_cases_title ?? ""} />
            <div className="grid gap-3 md:grid-cols-2">
              {[1, 2, 3, 4, 5].map((i) => {
                const key = `use_case_${i}`;
                return (
                  <div key={i} className="flex items-start gap-3 rounded-lg border border-violet-100 bg-white p-4">
                    <span className="mt-0.5 text-lg text-violet-500">▸</span>
                    <span className="text-sm text-slate-700">
                      {acc?.[key as keyof typeof acc] ?? ""}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ===== 价格表 ===== */}
          <section>
            <SectionLabel accent="slate" label="Pricing" />
            <SectionTitle text={acc?.pricing_title ?? ""} />
            <p className="mb-8 text-sm text-slate-500">{acc?.pricing_note ?? ""}</p>

            <div className="grid gap-8 lg:grid-cols-3">
              {(["japan", "usa", "europe"] as const).map((region) => {
                const route = PRICING[region];
                const labels: Record<string, string> = { japan: "Japan", usa: "USA", europe: "Europe" };
                return (
                  <div key={region} className="overflow-hidden rounded-xl border border-slate-200 shadow-sm">
                    <div className="border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 px-5 py-3">
                      <h3 className="text-sm font-bold text-slate-800">
                        {acc?.[route.label] ?? labels[region]}
                      </h3>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-slate-100 bg-white text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                            <th className="px-4 py-2.5">BW</th>
                            <th className="px-4 py-2.5">{acc?.pricing_ipv4 ?? "IPv4"}</th>
                            <th className="px-4 py-2.5 text-right">{acc?.pricing_price ?? "¥/mo"}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {route.tiers.map((t, i) => (
                            <tr key={t.bw} className={`border-b border-slate-50 bg-white last:border-0 hover:bg-blue-50/30 ${i % 2 === 0 ? "bg-white" : "bg-slate-50/30"}`}>
                              <td className="px-4 py-2 font-mono font-semibold text-slate-900">{t.bw}</td>
                              <td className="px-4 py-2 text-slate-500">{t.ipv4}</td>
                              <td className="px-4 py-2 text-right font-mono text-slate-900">{fmtPrice(t.price)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="mt-6 text-xs text-slate-400">
              * 20G–100G 超大带宽请联系我们获取报价。所有资费以 SHIXP 刊例价为准。
            </p>
          </section>

          {/* ===== CTA 询盘 ===== */}
          <section className="rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 shadow-lg">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="mb-3 text-2xl font-bold text-white">{acc?.cta_title ?? ""}</h2>
              <p className="mb-8 text-sm text-slate-300">{acc?.cta_desc ?? ""}</p>
              <div className="rounded-xl border border-slate-700 bg-slate-800/50 p-6 text-left">
                <InquiryForm productId="" locale={l} dict={dict} dark />
              </div>
            </div>
          </section>
        </div>
      </main>
      <Footer locale={l} dict={dict} />
    </>
  );
}

/* ----- 内联小组件（避免动态 Tailwind class） ----- */

/** 章节头部标签线 + 标签文字 */
function SectionLabel({ accent, label }: { accent: string; label: string }) {
  const barColors: Record<string, string> = {
    blue: "bg-blue-500",
    emerald: "bg-emerald-500",
    violet: "bg-violet-500",
    slate: "bg-slate-500",
    "white-blue": "bg-blue-400",
  };
  const textColors: Record<string, string> = {
    blue: "text-blue-600",
    emerald: "text-emerald-600",
    violet: "text-violet-600",
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

/** 章节主标题（h2） */
function SectionTitle({ text }: { text: string }) {
  return (
    <h2 className="mb-8 text-2xl font-bold text-slate-900 md:text-3xl">
      {text}
    </h2>
  );
}
