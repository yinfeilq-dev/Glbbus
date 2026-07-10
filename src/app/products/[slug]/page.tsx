// 产品详情页
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import InquiryForm from "@/components/product/inquiry-form";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Product, Supplier } from "@/lib/types";
import Link from "next/link";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
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
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* 面包屑 */}
        <nav className="mb-6 text-xs text-slate-400">
          <Link href="/" className="hover:text-blue-600">Home</Link>
          <span className="mx-2">&gt;</span>
          <Link href="/products" className="hover:text-blue-600">Products</Link>
          <span className="mx-2">&gt;</span>
          <span className="text-slate-600">{p.name_en}</span>
        </nav>

        <div className="flex flex-col gap-8 lg:flex-row">
          {/* 图片区 */}
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

          {/* 信息区 */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900">{p.name_en}</h1>
            <p className="mt-1 text-xs text-slate-400">SKU: {p.sku}</p>

            {/* 供应商标签 */}
            <div className="mt-3 inline-block rounded-md bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
              {supplier ? `🔧 ${supplier.name}` : ""}
            </div>

            {/* 规格表 */}
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

            {/* 认证 */}
            {p.certifications.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
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

            {/* 操作按钮 */}
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`https://wa.me/?text=Inquiry%20about%20${encodeURIComponent(p.sku)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-600"
              >
                💬 WhatsApp
              </a>
            </div>

            {/* 询盘表单 */}
            <div className="mt-8">
              <InquiryForm productId={p.id} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
