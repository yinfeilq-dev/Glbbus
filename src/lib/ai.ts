/**
 * AI SDK 配置 & 多语言生成工具
 */

import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

export const model = openai("gpt-4o");

export type ProductInfo = {
  name_en: string;
  name_zh?: string;
  category: string;
  material: string;
  specifications: Record<string, string>;
  certifications?: string[];
};

export type MultiLangDescription = Record<string, string>; // { en, zh, ru, es, ar }

const SUPPORTED_LANGS = ["en", "zh", "ru", "es", "ar"] as const;

/**
 * 自动生成多语言产品描述
 *
 * 输入: 产品基本信息（英/中文名、分类、材料、规格、认证）
 * 输出: 5语言的产品描述对象
 */
export async function generateMultiLangDescriptions(
  product: ProductInfo,
): Promise<MultiLangDescription> {
  const specLines = Object.entries(product.specifications)
    .map(([k, v]) => `  ${k.replace(/_/g, " ")}: ${v}`)
    .join("\n");

  const prompt = `You are a professional B2B industrial product copywriter. Generate a compelling product description in ALL 5 languages below.

Product Information:
- Name (EN): ${product.name_en}
- Name (ZH): ${product.name_zh ?? product.name_en}
- Category: ${product.category}
- Material: ${product.material}
- Specifications:
${specLines}
${product.certifications?.length ? `- Certifications: ${product.certifications.join(", ")}` : ""}

Languages to generate (use ISO codes as keys):
- en: English (professional B2B tone, 50-80 words)
- zh: 简体中文 (专业B2B语气, 50-80字)
- ru: Русский (профессиональный B2B тон)
- es: Español (tono profesional B2B)
- ar: العربية (نبرة احترافية B2B)

Response format — ONLY valid JSON, no markdown:
${JSON.stringify({
  en: "English description here...",
  zh: "中文描述...",
  ru: "Описание на русском...",
  es: "Descripción en español...",
  ar: "الوصف بالعربية...",
}, null, 2)}

Focus on: key specs, applications, quality assurance, and certifications.
Each description should be 50-80 words, unique per language (not a simple translation).
Use the same core facts but adapt phrasing to each market's B2B conventions.`;

  const result = await generateText({
    model,
    prompt,
    temperature: 0.3,
  });

  const text = result.text.trim();

  // 尝试从 JSON 代码块中提取
  try {
    const jsonMatch = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    const jsonStr = jsonMatch ? jsonMatch[1] : text;
    const parsed = JSON.parse(jsonStr);

    // 确保所有语言都存在
    for (const lang of SUPPORTED_LANGS) {
      if (!parsed[lang]) {
        parsed[lang] = parsed.en || `${product.name_en} - Description pending.`;
      }
    }

    return parsed as MultiLangDescription;
  } catch {
    // fallback: 返回包含英文描述的对象
    return {
      en: text.slice(0, 500),
      zh: product.name_zh ? `${product.name_zh} — 产品描述待生成。` : "",
      ru: "",
      es: "",
      ar: "",
    };
  }
}
