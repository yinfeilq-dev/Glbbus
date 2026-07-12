import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const baseUrl = "https://www.koudingcloud.com";
  const text = `User-agent: *
Allow: /

Disallow: /admin/
Disallow: /api/

Sitemap: ${baseUrl}/sitemap.xml
`;
  return new NextResponse(text, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
