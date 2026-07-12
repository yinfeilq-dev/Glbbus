/**
 * 供应商列表页（多语言支持）
 */

import { type Locale, locales, localizedPath } from "@/i18n/config";
import { loadDictionary, t } from "@/i18n/load-dictionary";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Supplier } from "@/lib/types";

type Props = {
  params: Promise<{ locale: string }>;
};

export const dynamic = "force-dynamic";

export default async function SuppliersPage({ params }: Props) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const l = locale as Locale;
  const dict = await loadDictionary(l);
  const supabase = await createClient();
  const nav = dict.navigation as Record<string, string>;

  const { data: suppliers } = await supabase
    .from("suppliers")
    .select("*")
    .order("name");

  // 获取每个供应商的产品数
  const supplierIds = (suppliers ?? []).map((s: Supplier) => s.id);
  const { data: counts } = await supabase
    .from("products")
    .select("supplier_id")
    .in("supplier_id", supplierIds);

  const productCounts: Record<string, number> = {};
  for (const p of counts ?? []) {
    productCounts[p.supplier_id] = (productCounts[p.supplier_id] ?? 0) + 1;
  }

  return (
    <>
      <Header locale={l} dict={dict} />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <nav className="mb-6 text-xs text-slate-400">
          <Link href={localizedPath(l, "/")} className="hover:text-blue-600">
            {nav?.home ?? "Home"}
          </Link>
          <span className="mx-2">&gt;</span>
          <span className="text-slate-600">
            {nav?.suppliers ?? "Suppliers"}
          </span>
        </nav>

        <h1 className="mb-8 text-2xl font-bold text-slate-900">
          {nav?.suppliers ?? "Suppliers"}
        </h1>

        <div className="grid gap-6 md:grid-cols-2">
          {(suppliers ?? []).length === 0 && (
            <div className="col-span-full flex flex-col items-center py-20 text-slate-400">
              <div className="mb-3 text-4xl">🏭</div>
              <p className="text-sm">
                {t(dict, "suppliers.description")}
              </p>
            </div>
          )}

          {(suppliers ?? []).map((supplier: Supplier) => (
            <div
              key={supplier.id}
              className="rounded-xl border border-slate-200 p-6"
            >
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-slate-900">
                  {supplier.name}
                </h2>
                <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                  {productCounts[supplier.id] ?? 0}{" "}
                  {t(dict, "products.count_label", { count: productCounts[supplier.id] ?? 0 }).replace(/[0-9]+\s+/, "").trim() || "products"}
                </span>
              </div>
              <p className="mb-3 text-sm text-slate-500">
                📍 {supplier.country}
              </p>
              {supplier.production_capacity && (
                <p className="mb-3 text-xs text-slate-400">
                  ⚙️ {supplier.production_capacity}
                </p>
              )}
              {supplier.certifications && supplier.certifications.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-1.5">
                  {(supplier.certifications as string[]).map((cert: string) => (
                    <span
                      key={cert}
                      className="rounded-md bg-green-50 px-2 py-0.5 text-xs text-green-700"
                    >
                      {cert}
                    </span>
                  ))}
                </div>
              )}
              <Link
                href={localizedPath(l, "/products") + `?supplier=${supplier.slug}`}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                {t(dict, "navigation.products")} →
              </Link>
            </div>
          ))}
        </div>
      </main>
      <Footer locale={l} dict={dict} />
    </>
  );
}
