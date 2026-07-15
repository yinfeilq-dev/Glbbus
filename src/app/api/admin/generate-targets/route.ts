import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type GeneratedTarget = {
  company_name: string;
  industry: string;
  country: string;
  source: "AI Generated";
  notes: string;
};

/**
 * Built-in product metadata for AI matching.
 * When none is selected, fallback to generic industry+country search.
 */
const PRODUCT_PROFILES: Record<string, { name: string; supplier: string; industry: string; description: string }> = {
  "DW-UHP-70M": {
    name: "DW-UHP-70M Ultra High Precision Metal 3D Printer",
    supplier: "德悟增材",
    industry: "metal 3D printing / additive manufacturing",
    description:
      "Ultra high precision metal 3D printer with ≤25μm spot size, supporting titanium alloy, aluminum alloy, stainless steel, and high-temp alloy. Price: $450,000. MOQ: 1.",
  },
  "DW-UHP-120M": {
    name: "DW-UHP-120M Ultra High Precision Metal 3D Printer",
    supplier: "德悟增材",
    industry: "metal 3D printing / additive manufacturing",
    description:
      "Ultra high precision metal 3D printer with ≤25μm spot size, supporting titanium alloy, aluminum alloy, stainless steel, and high-temp alloy. Price: $300,000. MOQ: 1.",
  },
  "DW-HP-200M": {
    name: "DW-HP-200M High Precision Metal 3D Printer (Dual Laser)",
    supplier: "德悟增材",
    industry: "metal 3D printing / additive manufacturing",
    description:
      "High precision metal 3D printer with ≤40μm spot size, dual laser option, supporting titanium alloy, aluminum alloy, stainless steel, and high-temp alloy. Price: $260,000. MOQ: 1.",
  },
  "shixp-international-acceleration": {
    name: "SHIXP International Network Acceleration",
    supplier: "国家（上海）新型互联网交换中心",
    industry: "cross-border network acceleration / international connectivity",
    description:
      "Cross-border network acceleration service via Shanghai Internet Exchange. Routes: Shanghai↔Japan, Shanghai↔USA, Shanghai↔Europe. Bandwidth 10M~10G, latency <1.15ms. For cross-border e-commerce, multinational enterprises, gaming, finance, and academia.",
  },
};

/**
 * Fallback: generate targets via rule-based templates when OpenAI is unavailable
 */
function fallbackGenerateTargets(industry: string, country: string): GeneratedTarget[] {
  const templates: string[] = [
    `Top ${industry} Manufacturer in ${country}`,
    `${industry} Supply Chain Solutions - ${country}`,
    `Leading ${industry} Exporter from ${country}`,
    `${industry} Trading Company in ${country}`,
    `${industry} Wholesale Distributor - ${country}`,
    `${industry} OEM/ODM Factory in ${country}`,
    `${industry} Raw Materials Supplier in ${country}`,
    `${industry} Components & Parts Manufacturer - ${country}`,
    `${industry} Engineering & Fabrication Services in ${country}`,
    `${industry} Procurement Agency in ${country}`,
  ];

  return templates.map((t, i) => ({
    company_name: `[${t}]`,
    industry,
    country,
    source: "AI Generated" as const,
    notes: `AI generated ${i + 1}/${templates.length}: ${t}`,
  }));
}

export async function POST(req: Request) {
  const supabase = createAdminClient();
  const body = await req.json();
  const { industry, country, mode, productSku } = body;

  // Resolve actual search context
  let effectiveIndustry = industry;
  let effectiveCountry = country;
  let productDescription = "";

  if (mode === "product" && productSku && PRODUCT_PROFILES[productSku]) {
    const profile = PRODUCT_PROFILES[productSku];
    effectiveIndustry = profile.industry;
    productDescription = profile.description;
  }

  if (!effectiveIndustry || !effectiveCountry) {
    return NextResponse.json({ error: "industry and country are required" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  // If no OpenAI key, use fallback
  if (!apiKey) {
    const targets = fallbackGenerateTargets(effectiveIndustry, effectiveCountry);
    return NextResponse.json({ targets });
  }

  try {
    let prompt: string;

    if (mode === "product" && productDescription) {
      prompt = `You are a B2B business development assistant. Generate a JSON array of 8 realistic, specific target customer companies that would buy or use the following product:

Product: ${productDescription}

Target market / country: ${effectiveCountry}

For each target company, provide:
- company_name: A realistic company name that would exist in ${effectiveCountry}
- industry: The specific sub-industry this company operates in
- country: ${effectiveCountry}
- source: "AI Generated"
- notes: A brief 1-2 sentence explanation of why this company might need or buy the product described above — be specific about the use case or application

Return ONLY a valid JSON array. No markdown, no additional text, no code fences.

Example format:
[
  {
    "company_name": "AeroPrecision GmbH",
    "industry": "aerospace component manufacturing",
    "country": "Germany",
    "source": "AI Generated",
    "notes": "Manufactures titanium alloy aerospace brackets — would benefit from ultra-high precision metal 3D printing to reduce waste and lead time on complex geometries."
  }
]`;
    } else {
      prompt = `You are a B2B business development assistant. Generate a JSON array of 10 realistic, specific target customer companies for a company that supplies industrial products.

Industry context: ${effectiveIndustry}
Target country: ${effectiveCountry}

For each item, provide:
- company_name: A realistic company name that would exist in ${effectiveCountry} in the ${effectiveIndustry} space
- industry: The specific sub-industry
- country: ${effectiveCountry}
- source: "AI Generated"
- notes: A brief 1-2 sentence description of what this company does

Return ONLY a valid JSON array. No markdown, no additional text, no code fences.

Example format:
[
  {
    "company_name": "Example Corp Ltd",
    "industry": "metal 3D printing",
    "country": "Germany",
    "source": "AI Generated",
    "notes": "A mid-sized additive manufacturing service bureau serving the aerospace and medical sectors."
  }
]`;
    }

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content:
              "You are a B2B lead generation assistant. Always respond with valid JSON arrays only, no extra text.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", errorText);
      const targets = fallbackGenerateTargets(effectiveIndustry, effectiveCountry);
      return NextResponse.json({ targets });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      const targets = fallbackGenerateTargets(effectiveIndustry, effectiveCountry);
      return NextResponse.json({ targets });
    }

    // Strip potential markdown fences
    let cleaned = content.trim();
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.slice(7);
    } else if (cleaned.startsWith("```")) {
      cleaned = cleaned.slice(3);
    }
    if (cleaned.endsWith("```")) {
      cleaned = cleaned.slice(0, -3);
    }
    cleaned = cleaned.trim();

    const targets: GeneratedTarget[] = JSON.parse(cleaned);
    return NextResponse.json({ targets });
  } catch (err) {
    console.error("generate-targets error:", err);
    const targets = fallbackGenerateTargets(effectiveIndustry, effectiveCountry);
    return NextResponse.json({ targets });
  }
}

/**
 * GET — expose product profile keys so the frontend can build the dropdown
 */
export async function GET() {
  const entries = Object.entries(PRODUCT_PROFILES).map(([sku, profile]) => ({
    sku,
    name: profile.name,
    supplier: profile.supplier,
    industry: profile.industry,
  }));
  return NextResponse.json({ products: entries });
}
