/**
 * 产品详情页（多语言支持）
 */

import { type Locale, locales, localizedPath } from "@/i18n/config";
import { loadDictionary, t } from "@/i18n/load-dictionary";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import InquiryForm from "@/components/product/inquiry-form";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Product, Supplier } from "@/lib/types";
import Link from "next/link";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export const dynamic = "force-dynamic";

export default async function ProductDetailPage({ params }: Props) {
  const { locale, slug } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const l = locale as Locale;
  const dict = await loadDictionary(l);
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*, suppliers(*)")
    .eq("sku", slug)
    .single();

  if (!product) notFound();

  const p = product as Product & { suppliers: Supplier };
  const specs = p.specifications;
  const supplier = p.suppliers;

  return (
    <>
      <Header locale={l} dict={dict} />
      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* 面包屑 */}
        <nav className="mb-6 text-xs text-slate-400">
          <Link
            href={localizedPath(l, "/")}
            className="hover:text-blue-600"
          >
            {t(dict, "products.breadcrumb_home")}
          </Link>
          <span className="mx-2">&gt;</span>
          <Link
            href={localizedPath(l, "/products")}
            className="hover:text-blue-600"
          >
            {t(dict, "products.breadcrumb_products")}
          </Link>
          <span className="mx-2">&gt;</span>
          <span className="text-slate-600">{p.name_en}</span>
        </nav>

        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="shrink-0 lg:w-[420px]">
            <div className="flex h-72 items-center justify-center rounded-xl bg-slate-100 text-sm text-slate-400 lg:h-80">
              📷 Product Image
            </div>
            <div className="mt-3 flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="flex h-14 w-14 items-center justify-center rounded-lg bg-slate-100 text-[10px] text-slate-400"
                >
                  📷
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900">{p.name_en}</h1>
            <p className="mt-1 text-xs text-slate-400">
              {t(dict, "products.sku_label")}: {p.sku}
            </p>

            <div className="mt-3 inline-block rounded-md bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              {supplier ? `🔧 ${supplier.name}` : ""}
            </div>

            {Object.keys(specs).length > 0 && (
              <table className="mt-5 w-full max-w-lg border-collapse text-sm">
                <tbody>
                  {Object.entries(specs).map(([key, val]) => (
                    <tr key={key} className="border-b border-slate-100">
                      <td className="w-1/3 py-2 pr-4 font-medium text-slate-500 capitalize">
                        {key.replace(/_/g, " ")}
                      </td>
                      <td className="py-2 text-slate-900">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {p.certifications.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs font-semibold text-slate-500">
                  {t(dict, "products.certifications")}:
                </span>
                {p.certifications.map((c) => (
                  <span
                    key={c}
                    className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600"
                  >
                    {c}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/?text=Inquiry%20about%20${encodeURIComponent(p.sku)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600"
              >
                {t(dict, "inquiry.whatsapp_button")}
              </a>
            </div>

            <div className="mt-8">
              <InquiryForm productId={p.id} locale={l} dict={dict} />
            </div>

            {/* CTA: 加速服务 */}
            <div className="mt-8 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-blue-800">
                    {t(dict, "common.cta_acceleration_title") ?? "Need faster cross-border access?"}
                  </p>
                  <p className="mt-1 text-xs text-blue-600">
                    {t(dict, "common.cta_acceleration_desc") ?? "Stable, low-latency network to access GlbBus and global platforms."}
                  </p>
                </div>
                <a
                  href={localizedPath(l, "/acceleration")}
                  className="shrink-0 rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {t(dict, "common.cta_acceleration_button") ?? "Learn More 🚀"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer locale={l} dict={dict} />
    </>
  );
}
