/**
 * 动态 sitemap.xml — 按语言生成所有公开页面
 * 包含：首页、产品、供应商、加速、关于、联系
 */
import { type Locale, locales } from "@/i18n/config";
import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// 公开静态路由（不含 locale 前缀）
const STATIC_ROUTES = ["", "products", "suppliers", "acceleration", "about", "contact"];

function xmlUrl(loc: string, priority = "0.8", changefreq = "weekly") {
  return `  <url>
    <loc>${loc}</loc>
    <priority>${priority}</priority>
    <changefreq>${changefreq}</changefreq>
  </url>`;
}

export async function GET() {
  const baseUrl = "https://www.koudingcloud.com";
  const urls: string[] = [];

  // 静态路由 × 5 种语言
  for (const locale of locales) {
    for (const route of STATIC_ROUTES) {
      const path = locale === "en" ? `/${route}` : `/${locale}/${route}`;
      const cleanPath = path.replace(/\/$/, "") || "/";
      urls.push(xmlUrl(`${baseUrl}${cleanPath}`));
    }
  }

  // 产品详情页
  try {
    const supabase = createAdminClient();
    const { data: products } = await supabase
      .from("products")
      .select("slug")
      .eq("is_published", true)
      .limit(500);

    if (products) {
      for (const p of products) {
        for (const locale of locales) {
          const path = locale === "en" ? `/products/${p.slug}` : `/${locale}/products/${p.slug}`;
          urls.push(xmlUrl(`${baseUrl}${path}`, "0.6", "monthly"));
        }
      }
    }
  } catch {
    // 忽略产品页面错误，sitemap 仍包含静态页面
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  return new NextResponse(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
