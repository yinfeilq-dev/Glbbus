/**
 * 产品中心页面（多语言支持）
 * 展示平台上所有供应商的产品，支持按供应商筛选
 * 数据从 Supabase products 表读取
 */

import { type Locale, locales } from "@/i18n/config";
import { loadDictionary, t } from "@/i18n/load-dictionary";
import { createClient } from "@/lib/supabase/server";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { notFound } from "next/navigation";
import Link from "next/link";

type Props = {
  params: Promise<{ locale: string }>;
};

type ProductWithSupplier = {
  id: string;
  sku: string;
  name_en: string;
  name_zh: string | null;
  description: Record<string, string> | null;
  specifications: Record<string, string> | null;
  base_price: number | null;
  category: string | null;
  images: string[];
  certifications: string[];
  moq: number | null;
  lead_time_days: number | null;
  fob_port: string | null;
  suppliers: { name: string; slug: string } | null;
};

async function getProducts(locale: Locale, supplierSlug?: string): Promise<ProductWithSupplier[]> {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select(`
      id, sku, name_en, name_zh, description, specifications,
      base_price, category, images, certifications, moq,
      lead_time_days, fob_port,
      suppliers (name, slug)
    `)
    .eq("is_published", true)
    .order("created_at", { ascending: false });

  if (supplierSlug) {
    // 先通过 supplier slug 拿到 ID
    const { data: supplier } = await supabase
      .from("suppliers")
      .select("id")
      .eq("slug", supplierSlug)
      .single();

    if (supplier) {
      query = query.eq("supplier_id", supplier.id);
    }
  }

  const { data } = await query;
  return (data as unknown as ProductWithSupplier[]) || [];
}

async function getSuppliers(): Promise<{ name: string; slug: string }[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("suppliers")
    .select("name, slug")
    .order("name");
  return data || [];
}

export default async function ProductsPage({ params }: Props) {
  const { locale, ...searchParams } = await params;
  // We'll handle search params via URL in a server component
  // For simplicity, we fetch all products

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const l = locale as Locale;
  const dict = await loadDictionary(l);
  const products = await getProducts(l);
  const suppliers = await getSuppliers();

  // 从 nav dict 读取
  const nav = dict.navigation as Record<string, string>;
  const common = dict.common as Record<string, string>;
  const productsDict = dict.products as Record<string, string> ?? {};

  const isChinese = l === "zh";

  return (
    <>
      <Header locale={l} dict={dict} />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-slate-800 to-slate-900 text-white">
          <div className="mx-auto max-w-7xl px-4 py-16">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {productsDict.page_title || "Product Center"}
            </h1>
            <p className="mt-3 max-w-2xl text-base text-slate-300">
              {productsDict.page_desc || "Browse our product catalog from verified suppliers"}
            </p>
          </div>
        </section>

        {/* Supplier Filter */}
        <section className="mx-auto max-w-7xl px-4 py-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-medium text-slate-600">
              {productsDict.filter_by_supplier || "Filter by supplier:"}
            </span>
            <Link
              href={`/${l}/products`}
              className="rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
            >
              {productsDict.all || "All"}
            </Link>
            {suppliers.map((s) => (
              <Link
                key={s.slug}
                href={`/${l}/products?supplier=${s.slug}`}
                className="rounded-full border border-slate-200 bg-white px-4 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-600"
              >
                {s.name}
              </Link>
            ))}
          </div>
        </section>

        {/* Product Grid */}
        <section className="mx-auto max-w-7xl px-4 pb-16">
          {products.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-slate-400">
              <div className="mb-4 text-5xl">📦</div>
              <p className="text-base font-medium">{productsDict.no_products || "No products available yet."}</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/${l}/products/${product.sku}`}
                  className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-blue-300"
                >
                  {/* Category Badge */}
                  {product.category && (
                    <span className="mb-2 inline-block rounded-full bg-blue-50 px-2.5 py-0.5 text-[10px] font-medium text-blue-600">
                      {product.category}
                    </span>
                  )}

                  {/* Product Name */}
                  <h3 className="mt-1 text-sm font-semibold text-slate-900 group-hover:text-blue-600 line-clamp-2">
                    {isChinese && product.name_zh ? product.name_zh : product.name_en}
                  </h3>

                  {/* Supplier */}
                  <p className="mt-1 text-xs text-slate-400">
                    {product.suppliers?.name || "GlbBus"}
                  </p>

                  {/* Key Specs */}
                  {product.specifications && Object.keys(product.specifications).length > 0 && (
                    <div className="mt-3 space-y-1">
                      {Object.entries(product.specifications).slice(0, 3).map(([key, val]) => (
                        <div key={key} className="flex justify-between text-xs">
                          <span className="text-slate-400 capitalize">{key}:</span>
                          <span className="text-slate-600 font-medium">{val}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Price & Lead Time */}
                  <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                    <div>
                      {product.base_price != null && (
                        <span className="text-sm font-bold text-green-600">
                          ${product.base_price.toFixed(2)}
                        </span>
                      )}
                      {product.moq && (
                        <span className="ml-2 text-[10px] text-slate-400">
                          MOQ: {product.moq}
                        </span>
                      )}
                    </div>
                    {product.lead_time_days && (
                      <span className="text-[10px] text-slate-400">
                        {product.lead_time_days}d
                      </span>
                    )}
                  </div>

                  {/* Certifications */}
                  {product.certifications && product.certifications.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1">
                      {product.certifications.map((cert) => (
                        <span key={cert} className="rounded bg-green-50 px-1.5 py-0.5 text-[9px] text-green-600">
                          {cert}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer locale={l} dict={dict} />
    </>
  );
}
