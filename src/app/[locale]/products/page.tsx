/**
 * 产品列表页（多语言支持）
 */

import { type Locale, locales } from "@/i18n/config";
import { loadDictionary, t } from "@/i18n/load-dictionary";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ProductCard from "@/components/product/product-card";
import { createClient } from "@/lib/supabase/server";
import type { Product } from "@/lib/types";
import { notFound } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export const dynamic = "force-dynamic";

export default async function ProductsPage({ params }: Props) {
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
    .order("created_at", { ascending: false });

  const list = (products ?? []) as (Product & { suppliers: { name: string } })[];

  const categories = [...new Set(list.map((p) => p.category).filter(Boolean))];

  return (
    <>
      <Header locale={l} dict={dict} />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="mb-2 text-2xl font-bold text-slate-900">
          {t(dict, "products.page_title")}
        </h1>
        <p className="mb-8 text-sm text-slate-400">
          {t(dict, "products.count_label", { count: list.length })}
        </p>

        <div className="flex gap-8">
          {categories.length > 0 && (
            <aside className="hidden w-48 shrink-0 lg:block">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                {t(dict, "products.categories")}
              </h3>
              <ul className="space-y-1.5">
                <li>
                  <button className="w-full rounded-md bg-blue-50 px-3 py-1.5 text-left text-sm font-medium text-blue-700">
                    {t(dict, "products.all_categories")}
                  </button>
                </li>
                {categories.map((cat) => (
                  <li key={cat}>
                    <button className="w-full rounded-md px-3 py-1.5 text-left text-sm text-slate-600 hover:bg-slate-50">
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </aside>
          )}

          <div className="flex-1">
            {list.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {list.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    locale={l}
                    dict={dict}
                    supplierName={p.suppliers?.name}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center py-20 text-slate-400">
                <div className="mb-3 text-4xl">📦</div>
                <p className="text-sm">{t(dict, "products.no_products")}</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer locale={l} dict={dict} />
    </>
  );
}
