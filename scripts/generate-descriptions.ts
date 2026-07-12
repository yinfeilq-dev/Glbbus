/**
 * 多语言产品描述批量生成脚本
 *
 * 遍历所有 description 为空的已发布产品，
 * 调用 AI SDK 生成 5 语言描述后更新到数据库
 *
 * 运行: npx tsx scripts/generate-descriptions.ts
 */

import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

const model = openai("gpt-4o");

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

async function generateDescription(product: ProductRow): Promise<Record<string, string>> {
  const specLines = Object.entries(product.specifications || {})
    .map(([k, v]) => `  ${k.replace(/_/g, " ")}: ${v}`)
    .join("\n");

  const certs = (product.certifications || []).join(", ");

  const prompt = `You are a professional B2B industrial product copywriter. Generate a compelling product description in ALL 5 languages.

Product:
- Name (EN): ${product.name_en}
- Name (ZH): ${product.name_zh ?? product.name_en}
- Category: ${product.category ?? "General"}
${specLines}
${certs ? `- Certifications: ${certs}` : ""}

Generate for these 5 languages (use ISO codes as keys):
- en: English (professional B2B tone, 50-80 words, natural — not a literal translation)
- zh: 简体中文 (专业B2B语气, 50-80字, 自然)
- ru: Русский (профессиональный B2B тон, 50-80 слов)
- es: Español (tono profesional B2B, 50-80 palabras)
- ar: العربية (نبرة احترافية B2B, 50-80 كلمة)

CRITICAL: Output ONLY a valid JSON object. No markdown backticks, no extra text.

Focus on: key specs, typical applications, quality assurance. Each language should be independently written (not a simple translation).`;

  const result = await generateText({
    model,
    prompt,
    temperature: 0.3,
  });

  const text = result.text.trim();

  // Parse JSON
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonStr = jsonMatch ? jsonMatch[0] : text;
    const parsed = JSON.parse(jsonStr);

    return {
      en: parsed.en || "",
      zh: parsed.zh || "",
      ru: parsed.ru || "",
      es: parsed.es || "",
      ar: parsed.ar || "",
    };
  } catch (e) {
    console.warn(`  ⚠️ Failed to parse JSON for ${product.sku}, using fallback`);
    return {
      en: text.slice(0, 500),
      zh: "",
      ru: "",
      es: "",
      ar: "",
    };
  }
}

async function main() {
  // 获取所有 description 为空的产品
  const { data: products, error } = await supabase
    .from("products")
    .select("id, sku, name_en, name_zh, category, specifications, certifications, description")
    .eq("is_published", true)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch products:", error.message);
    process.exit(1);
  }

  // 只处理 description 中主要语言为空的产品
  const needsGen = (products as ProductRow[]).filter(
    (p) => !p.description?.en,
  );

  console.log(`📊 ${products.length} total products`);
  console.log(`🔄 ${needsGen.length} need description generation\n`);

  let success = 0;
  let fail = 0;

  for (const product of needsGen) {
    process.stdout.write(`  Generating: ${product.sku} (${product.name_en})... `);

    try {
      const desc = await generateDescription(product);

      const { error: updateErr } = await supabase
        .from("products")
        .update({ description: desc })
        .eq("id", product.id);

      if (updateErr) {
        console.log(`❌ Update error: ${updateErr.message}`);
        fail++;
      } else {
        console.log(`✅`);
        success++;
      }
    } catch (err) {
      console.log(`❌ ${err instanceof Error ? err.message : "Unknown error"}`);
      fail++;
    }

    // 限速：每秒 2 个请求
    await new Promise((r) => setTimeout(r, 500));
  }

  console.log(`\n🎉 Done! ${success} succeeded, ${fail} failed`);
}

main().catch(console.error);
