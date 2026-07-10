// 首页 —— 营销落地页
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ProductCard from "@/components/product/product-card";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = await createClient();

  // 取已发布的产品 + 供应商名称
  const { data: products } = await supabase
    .from("products")
    .select("*, suppliers(name)")
    .eq("is_published", true)
    .limit(4);

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-700 to-violet-600 text-white">
          <div className="mx-auto max-w-7xl px-4 py-20">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Industrial Products, Sourced Globally
            </h1>
            <p className="mt-4 max-w-xl text-lg text-white/75">
              Connect with verified manufacturers for your B2B industrial needs.
              AI-powered matching, real-time quotes, end-to-end support.
            </p>
            <div className="mt-8 flex max-w-lg">
              <input
                placeholder="Search by product name, material, spec..."
                className="w-full rounded-l-lg border-0 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
              />
              <button className="rounded-r-lg bg-blue-600 px-6 py-3 text-sm font-semibold hover:bg-blue-700">
                Search
              </button>
            </div>
          </div>
        </section>

        {/* 供应商品牌 */}
        <section className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex items-center gap-4">
            <span className="text-xs text-slate-400">Trusted Suppliers:</span>
            <div className="flex gap-3">
              <span className="rounded-md bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
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
          <h2 className="mb-6 text-xl font-bold text-slate-900">Product Categories</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              { icon: "🏗️", name: "Aluminum Profiles", count: "42 products" },
              { icon: "🔩", name: "Fasteners & Hardware", count: "38 products" },
              { icon: "⚡", name: "Electrical Components", count: "27 products" },
              { icon: "⛓️", name: "Industrial Machinery", count: "19 products" },
            ].map((cat) => (
              <div
                key={cat.name}
                className="rounded-xl border border-slate-200 p-4 text-center transition hover:border-blue-200 hover:shadow-sm"
              >
                <div className="mb-1 text-2xl">{cat.icon}</div>
                <div className="text-sm font-semibold text-slate-900">{cat.name}</div>
                <div className="mt-0.5 text-xs text-slate-400">{cat.count}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 产品推荐 */}
        <section className="mx-auto max-w-7xl px-4 py-8">
          <h2 className="mb-6 text-xl font-bold text-slate-900">Featured Products</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {products && products.length > 0 ? (
              products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  supplierName={(p as any).suppliers?.name}
                />
              ))
            ) : (
              <>
                {/* 无数据时展示占位卡片 */}
                {[
                  {
                    name: "6063-T5 Aluminum Extrusion",
                    supplier: "Dewu Industrial",
                    price: 2.45,
                    cert: ["CE", "RoHS"],
                  },
                  {
                    name: "Stainless Steel 304 Flange",
                    supplier: "Waru Manufacturing",
                    price: 0.89,
                    cert: ["ISO 9001"],
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
                      ${item.price.toFixed(2)}
                      <span className="text-xs font-normal text-slate-400">
                        {item.price < 50 ? "/pc" : "/m"}
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
              { icon: "✅", label: "Factory Verified" },
              { icon: "📋", label: "On-time Delivery" },
              { icon: "🌍", label: "Global Shipping" },
              { icon: "🤖", label: "AI Match" },
              { icon: "🔒", label: "Secure Payments" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <div className="text-xl">{item.icon}</div>
                <div className="mt-1 text-xs text-slate-400">{item.label}</div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
