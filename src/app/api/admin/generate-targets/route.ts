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
  const { industry, country } = body;

  if (!industry || !country) {
    return NextResponse.json({ error: "industry and country are required" }, { status: 400 });
  }

  const apiKey = process.env.OPENAI_API_KEY;

  // If no OpenAI key, use fallback
  if (!apiKey) {
    const targets = fallbackGenerateTargets(industry, country);
    return NextResponse.json({ targets });
  }

  try {
    const prompt = `You are a B2B business development assistant. Generate a JSON array of 10 realistic, specific target customer companies for a company that supplies industrial products (aluminum profiles, fasteners, electrical components, CNC/machining parts, etc.).

Industry context: ${industry}
Target country: ${country}

For each item, provide:
- company_name: A realistic company name that would exist in ${country} in the ${industry} space
- industry: The specific sub-industry
- country: ${country}
- source: "AI Generated"
- notes: A brief 1-2 sentence description of what this company does

Return ONLY a valid JSON array. No markdown, no additional text, no code fences.

Example format:
[
  {
    "company_name": "Example Corp Ltd",
    "industry": "aluminum profiles",
    "country": "Germany",
    "source": "AI Generated",
    "notes": "A mid-sized aluminum extrusion manufacturer serving the automotive sector."
  }
]`;

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
      // Fallback on API error
      const targets = fallbackGenerateTargets(industry, country);
      return NextResponse.json({ targets });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      const targets = fallbackGenerateTargets(industry, country);
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
    const targets = fallbackGenerateTargets(industry, country);
    return NextResponse.json({ targets });
  }
}
