/**
 * 产品详情页面（多语言支持）
 * 展示单个产品的全部信息：规格参数、描述、图片、询盘入口
 * 路径: /{locale}/products/{sku}
 */

import { type Locale, locales, localizedPath } from "@/i18n/config";
import { loadDictionary, t } from "@/i18n/load-dictionary";
import { createClient } from "@/lib/supabase/server";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { notFound } from "next/navigation";
import Link from "next/link";
import InquiryForm from "./inquiry-form";

type Props = {
  params: Promise<{ locale: string; sku: string }>;
};

type ProductDetail = {
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
  suppliers: { name: string; slug: string; country: string | null } | null;
};

async function getProduct(sku: string): Promise<ProductDetail | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(`
      id, sku, name_en, name_zh, description, specifications,
      base_price, category, images, certifications, moq,
      lead_time_days, fob_port,
      suppliers (name, slug, country)
    `)
    .eq("sku", sku)
    .eq("is_published", true)
    .single();

  return data as unknown as ProductDetail | null;
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale, sku } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const l = locale as Locale;
  const dict = await loadDictionary(l);
  const product = await getProduct(sku);

  if (!product) {
    notFound();
  }

  const common = dict.common as Record<string, string>;
  const nav = dict.navigation as Record<string, string>;
  const productsDict = dict.products as Record<string, string> ?? {};

  const isChinese = l === "zh";

  // 取当前语言描述
  const description = product.description?.[l] || product.description?.en || null;

  return (
    <>
      <Header locale={l} dict={dict} />
      <main>
        {/* Breadcrumb */}
        <section className="mx-auto max-w-7xl px-4 py-4">
          <nav className="flex items-center gap-2 text-xs text-slate-400">
            <Link href={localizedPath(l, "/")} className="hover:text-blue-600">
              {nav.home || "Home"}
            </Link>
            <span>/</span>
            <Link href={localizedPath(l, "/products")} className="hover:text-blue-600">
              {productsDict.page_title || "Products"}
            </Link>
            <span>/</span>
            <span className="text-slate-600">
              {isChinese && product.name_zh ? product.name_zh : product.name_en}
            </span>
          </nav>
        </section>

        {/* Product Detail */}
        <section className="mx-auto max-w-7xl px-4 pb-16">
          <div className="grid gap-8 lg:grid-cols-5">
            {/* Left: Product Info */}
            <div className="lg:col-span-3">
              {/* Category */}
              {product.category && (
                <span className="mb-3 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600">
                  {product.category}
                </span>
              )}

              <h1 className="text-2xl font-bold text-slate-900">
                {isChinese && product.name_zh ? product.name_zh : product.name_en}
              </h1>

              {/* Supplier Info */}
              {product.suppliers && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    🏭 {product.suppliers.name}
                  </span>
                  {product.suppliers.country && (
                    <span className="text-xs text-slate-400">
                      📍 {product.suppliers.country}
                    </span>
                  )}
                </div>
              )}

              {/* Price & Trade Info */}
              <div className="mt-6 grid grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-4">
                {product.base_price != null && (
                  <div>
                    <div className="text-xs text-slate-400">{productsDict.price || "Price"}</div>
                    <div className="text-lg font-bold text-green-600">${product.base_price.toFixed(2)}</div>
                  </div>
                )}
                {product.moq && (
                  <div>
                    <div className="text-xs text-slate-400">MOQ</div>
                    <div className="text-sm font-semibold text-slate-900">{product.moq} pcs</div>
                  </div>
                )}
                {product.lead_time_days && (
                  <div>
                    <div className="text-xs text-slate-400">{productsDict.lead_time || "Lead Time"}</div>
                    <div className="text-sm font-semibold text-slate-900">{product.lead_time_days} days</div>
                  </div>
                )}
                {product.fob_port && (
                  <div>
                    <div className="text-xs text-slate-400">{productsDict.fob_port || "FOB Port"}</div>
                    <div className="text-sm font-semibold text-slate-900">{product.fob_port}</div>
                  </div>
                )}
              </div>

              {/* Description */}
              {description && (
                <div className="mt-8">
                  <h2 className="mb-3 text-base font-semibold text-slate-900">
                    {productsDict.description || "Description"}
                  </h2>
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-slate-600">
                    {description}
                  </div>
                </div>
              )}

              {/* Technical Specifications */}
              {product.specifications && Object.keys(product.specifications).length > 0 && (
                <div className="mt-8">
                  <h2 className="mb-3 text-base font-semibold text-slate-900">
                    {productsDict.specifications || "Technical Specifications"}
                  </h2>
                  <div className="overflow-hidden rounded-xl border border-slate-200">
                    <table className="w-full text-left text-sm">
                      <tbody>
                        {Object.entries(product.specifications).map(([key, val], idx) => (
                          <tr key={key} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                            <td className="px-4 py-2.5 font-medium text-slate-600 capitalize w-1/3">
                              {key.replace(/_/g, " ")}
                            </td>
                            <td className="px-4 py-2.5 text-slate-900">{val}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Certifications */}
              {product.certifications && product.certifications.length > 0 && (
                <div className="mt-8">
                  <h2 className="mb-3 text-base font-semibold text-slate-900">
                    {productsDict.certifications || "Certifications"}
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {product.certifications.map((cert) => (
                      <span key={cert} className="rounded-lg border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700">
                        ✅ {cert}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* SKU */}
              <div className="mt-8 text-xs text-slate-400">
                SKU: <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">{product.sku}</code>
              </div>
            </div>

            {/* Right: Inquiry Form */}
            <div className="lg:col-span-2">
              <div className="sticky top-24">
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-6">
                  <h2 className="mb-4 text-base font-semibold text-blue-900">
                    {productsDict.inquiry_title || "Inquire Now"}
                  </h2>
                  <InquiryForm locale={l} dict={dict} productId={product.id} productName={
                    isChinese && product.name_zh ? product.name_zh : product.name_en
                  } />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer locale={l} dict={dict} />
    </>
  );
}
