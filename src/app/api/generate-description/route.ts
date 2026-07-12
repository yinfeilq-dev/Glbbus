/**
 * 多语言产品描述生成 API
 *
 * POST /api/generate-description
 * Body: { name_en, name_zh?, category, material, specifications, certifications? }
 *
 * 返回: { description: { en, zh, ru, es, ar } }
 */

import { generateMultiLangDescriptions, type ProductInfo } from "@/lib/ai";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as ProductInfo;

    // 基本校验
    if (!body.name_en || !body.category || !body.material || !body.specifications) {
      return NextResponse.json(
        { error: "name_en, category, material, and specifications are required" },
        { status: 400 },
      );
    }

    const description = await generateMultiLangDescriptions(body);

    return NextResponse.json({ success: true, description });
  } catch (err) {
    console.error("[generate-description] Error:", err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      { error: "Generation failed: " + msg },
      { status: 500 },
    );
  }
}
