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
import { readFileSync } from "fs";

// 德悟供应商介绍（从说明文件读取，编译时嵌入）
const DEWU_PRODUCT_LINES = `
### 业务线一：传统工业品制造
- **铝合金型材**：6063-T5 / 6060-T6 等工业铝型材，散热器型材，T型槽型材
- **紧固件**：螺栓、螺母、垫圈、弹簧等碳钢/不锈钢件
- **电气元器件**：端子排、继电器底座、导轨、线槽等
- **定制 CNC 加工**：精密轴杆、齿轮、支架、外壳等高精度零件

### 业务线二：微细精密金属3D打印
苏州德悟增材技术有限公司 — 微细精密金属3D打印设备制造专家，由上海交通大学、西北工业大学等知名高校硕/博毕业生创立。

**核心技术指标：**
- 成形精度 2-15μm · 表面粗糙度 Ra0.5-1.5μm · 无支撑角度 ≥10°
- 力学性能较常规提升15-25% · 最薄壁厚28μm · 最小孔径/杆径30μm

**主要设备：** DW-UHP-120M（Ф120×180mm）、DW-UHP-70M（Ф70×100mm）、DW-HP-200M（200×200×200mm）

**目标行业：** 精密医疗器械 · 航空航天 · 微流道散热组件 · 半导体组件
`;

const WARU_PRODUCT_LINES = `
- **管件与法兰**：不锈钢/碳钢法兰、弯头、三通、管接头
- **电机**：工业电机、减速电机、伺服电机
- **气动元件**：气缸、电磁阀、气动接头
- **密封件**：O型圈、油封、垫片
- **液压元件**：液压接头、管件、阀组
`;

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

          {(suppliers ?? []).map((supplier: Supplier) => {
            const isDewu = supplier.slug === "dewu-industrial";
            const isWaru = supplier.slug === "waru-manufacturing";
            const productLinesHtml = isDewu ? DEWU_PRODUCT_LINES : isWaru ? WARU_PRODUCT_LINES : "";

            return (
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

              {/* 产品线详细介绍 */}
              {productLinesHtml && (
                <div className="mb-4 rounded-lg bg-slate-50 p-4 text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                  {productLinesHtml}
                </div>
              )}

              <Link
                href={localizedPath(l, "/products") + `?supplier=${supplier.slug}`}
                className="text-sm font-medium text-blue-600 hover:text-blue-700"
              >
                {t(dict, "navigation.products")} →
              </Link>
            </div>
            );
          })}
        </div>
      </main>
      <Footer locale={l} dict={dict} />
    </>
  );
}
