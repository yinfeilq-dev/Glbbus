/**
 * 首页 —— 营销落地页（多语言支持）
 */

import { type Locale, locales } from "@/i18n/config";
import { loadDictionary, t } from "@/i18n/load-dictionary";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ProductCard from "@/components/product/product-card";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

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

  const supabase = await createClient();

  const { data: products } = await supabase
    .from("products")
    .select("*, suppliers(name)")
    .eq("is_published", true)
    .limit(4);

  return (
    <>
      <Header locale={l} dict={dict} />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-700 to-violet-600 text-white">
          <div className="mx-auto max-w-7xl px-4 py-20">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              {t(dict, "home.hero_title")}
            </h1>
            <p className="mt-4 max-w-xl text-lg text-white/75">
              {t(dict, "home.hero_subtitle")}
            </p>
            <div className="mt-8 flex max-w-lg">
              <input
                placeholder={t(dict, "common.search_placeholder")}
                className="w-full rounded-l-lg border-0 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
              <button className="rounded-r-lg bg-blue-600 px-6 py-3 text-sm font-semibold hover:bg-blue-700">
                {t(dict, "common.search_button")}
              </button>
            </div>
          </div>
        </section>

        {/* 供应商品牌 */}
        <section className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400">
              {t(dict, "common.trusted_suppliers")}
            </span>
            <div className="flex gap-3">
              <span className="rounded-md bg-indigo-100 px-3 py-1.5 text-xs font-semibold text-indigo-700" title="铝型材·紧固件·电气·CNC·金属3D打印">
                🔧 Dewu Industrial
              </span>
              <span className="rounded-md bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                ⚙️ Waru Manufacturing
              </span>
            </div>
          </div>
        </section>

        {/* 分类 */}
        <section className="mx-auto max-w-7xl px-4 py-8">
          <h2 className="mb-6 text-xl font-bold text-slate-900">
            {t(dict, "home.categories_title")}
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { icon: "🏗️", name: t(dict, "common.site_tagline").includes("Industrial")
                ? "Aluminum Profiles" : "铝型材", count: "42" },
              { icon: "🔩", name: "Fasteners & Hardware", count: "38" },
              { icon: "⚡", name: "Electrical Components", count: "27" },
              { icon: "⚙️", name: "CNC Machining", count: "19" },
              { icon: "🖨️", name: "Metal 3D Printing", count: "3" },
              { icon: "⛓️", name: "Industrial Machinery", count: "19" },
            ].map((cat) => (
              <div
                key={cat.name}
                className="rounded-xl border border-slate-200 p-4 text-center transition hover:border-blue-200 hover:shadow-sm"
              >
                <div className="mb-1 text-2xl">{cat.icon}</div>
                <div className="text-sm font-semibold text-slate-900">{cat.name}</div>
                <div className="mt-0.5 text-xs text-slate-400">{cat.count} products</div>
              </div>
            ))}
          </div>
        </section>

        {/* 产品推荐 */}
        <section className="mx-auto max-w-7xl px-4 py-8">
          <h2 className="mb-6 text-xl font-bold text-slate-900">
            {t(dict, "home.featured_title")}
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products && products.length > 0 ? (
              products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  locale={l}
                  dict={dict}
                  supplierName={(p as any).suppliers?.name}
                />
              ))
            ) : (
              <>
                {[
                  {
                    name: "6063-T5 Aluminum Extrusion",
                    supplier: "Dewu Industrial",
                    price: 2.45,
                    cert: ["CE", "RoHS"],
                  },
                  {
                    name: "DW-UHP-120M Metal 3D Printer",
                    supplier: "Dewu Additive",
                    price: 0,
                    cert: ["Precision ≤25μm"],
                  },
                  {
                    name: "CNC Machined Bracket",
                    supplier: "Dewu Industrial",
                    price: 1.23,
                    cert: ["RoHS"],
                  },
                  {
                    name: "Industrial Conveyor Belt",
                    supplier: "Waru Manufacturing",
                    price: 34.0,
                    cert: ["CE"],
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="rounded-xl border border-slate-200 bg-white p-4"
                  >
                    <div className="mb-3 flex h-36 items-center justify-center rounded-lg bg-slate-100 text-sm text-slate-400">
                      📷 Product Image
                    </div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      {item.name}
                    </h3>
                    <p className="mt-1 text-xs text-slate-400">{item.supplier}</p>
                    <p className="mt-2 text-base font-bold text-blue-600">
                      {item.price > 0 ? `$${item.price.toFixed(2)}` : "Contact for Pricing"}
                      <span className="text-xs font-normal text-slate-400">
                        {item.price > 0 && (item.price < 50 ? "/pc" : "/m")}
                      </span>
                    </p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {item.cert.map((c) => (
                        <span
                          key={c}
                          className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-600"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            )}
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
