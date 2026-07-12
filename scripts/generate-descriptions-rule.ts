/**
 * 多语言描述生成器 —— 模板规则版
 *
 * 对于每个产品，用模板规则生成 5 语言的描述文本。
 * 后续网络通了可切换到 AI SDK 版本（generate-descriptions-ai.ts）。
 *
 * 运行: npx tsx scripts/generate-descriptions-rule.ts
 */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

type ProductRow = {
  id: string;
  sku: string;
  name_en: string;
  name_zh: string | null;
  category: string | null;
  specifications: Record<string, string>;
  certifications: string[];
  description: Record<string, string>;
};

// ===== 模板生成逻辑 =====

function buildDescriptions(product: ProductRow): Record<string, string> {
  const name = product.name_en;
  const nameZh = product.name_zh || name;
  const cat = product.category || "Industrial";
  const specs = Object.entries(product.specifications || {});
  const specBullets = specs.map(([k, v]) => `• ${k.replace(/_/g, " ")}: ${v}`).join("\n");
  const certs = (product.certifications || []).join(", ");
  const certLine = certs ? ` | Certified: ${certs}` : "";

  return {
    en: `${name} — Premium ${cat.toLowerCase()} for global B2B buyers. Manufactured to strict quality standards with precision engineering.\n\nKey Specifications:\n${specBullets}\n\nMOQ and lead time available upon request.${certLine ? ` ${certLine}` : ""}\n\nContact our sales team for bulk pricing and technical datasheets.`,

    zh: `${nameZh} — 高品质${cat === "Aluminum Profiles" ? "铝型材" : cat === "Fasteners & Hardware" ? "紧固件/五金件" : cat === "Electrical Components" ? "电气元件" : cat === "Industrial Machinery" ? "工业机械设备" : "工业产品"}，面向全球B2B买家。严格按照质量标准制造，精密工程保证。\n\n主要规格：\n${specBullets}\n\n起订量和交期可商议。${certLine ? ` ${certLine}` : ""}\n\n联系销售团队获取批量报价和技术资料。`,

    ru: `${name} — высококачественный ${(cat === "Aluminum Profiles" ? "алюминиевый профиль" : cat === "Fasteners & Hardware" ? "крепеж/метизы" : cat === "Electrical Components" ? "электротехнические компоненты" : cat === "Industrial Machinery" ? "промышленное оборудование" : "промышленный продукт")} для глобальных B2B-покупателей. Произведено по строгим стандартам качества.\n\nОсновные спецификации:\n${specBullets}\n\nMOQ и срок поставки по запросу.${certLine ? ` ${certLine}` : ""}\n\nСвяжитесь с нашим отделом продаж для оптовых цен и техдокументации.`,

    es: `${name} — ${(cat === "Aluminum Profiles" ? "perfil de aluminio" : cat === "Fasteners & Hardware" ? "sujeciones/herrajes" : cat === "Electrical Components" ? "componentes eléctricos" : cat === "Industrial Machinery" ? "maquinaria industrial" : "producto industrial")} de primera calidad para compradores B2B globales. Fabricado bajo estrictos estándares de calidad.\n\nEspecificaciones clave:\n${specBullets}\n\nMOQ y plazo de entrega disponibles bajo consulta.${certLine ? ` ${certLine}` : ""}\n\nContacte a nuestro equipo de ventas para precios al por mayor y fichas técnicas.`,

    ar: `${name} — ${(cat === "Aluminum Profiles" ? "مقطع ألمنيوم" : cat === "Fasteners & Hardware" ? "مثبتات/عدد يدوية" : cat === "Electrical Components" ? "مكونات كهربائية" : cat === "Industrial Machinery" ? "آلات صناعية" : "منتج صناعي")} عالي الجودة للمشترين العالميين (B2B). تم التصنيع وفقًا لمعايير الجودة الصارمة.\n\nالمواصفات الرئيسية:\n${specBullets}\n\nالحد الأدنى للطلب ومهلة التسليم متوفرة عند الطلب.${certLine ? ` ${certLine}` : ""}\n\nاتصل بفريق المبيعات لدينا للأسعار بالجملة وأوراق البيانات الفنية.`,
  };
}

// ===== 主流程 =====

async function main() {
  const { data: products, error } = await supabase
    .from("products")
    .select("id, sku, name_en, name_zh, category, specifications, certifications, description")
    .eq("is_published", true)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch products:", error.message);
    process.exit(1);
  }

  // 只处理尚未有英文描述的
  const needsGen = (products as ProductRow[]).filter(
    (p) => !p.description?.en,
  );

  console.log(`📊 ${products.length} total products`);
  console.log(`🔄 ${needsGen.length} need description generation (template rule)\n`);

  let success = 0;

  for (const product of needsGen) {
    process.stdout.write(`  ${product.sku}... `);

    const desc = buildDescriptions(product);

    const { error: updateErr } = await supabase
      .from("products")
      .update({ description: desc })
      .eq("id", product.id);

    if (updateErr) {
      console.log(`❌ ${updateErr.message}`);
    } else {
      console.log(`✅`);
      success++;
    }
  }

  console.log(`\n🎉 Done! ${success}/${needsGen.length} descriptions generated (template-based)`);
  console.log(`   To switch to AI-generated descriptions later, run:`);
  console.log(`   npx tsx scripts/generate-descriptions.ts`);
}

main().catch(console.error);
