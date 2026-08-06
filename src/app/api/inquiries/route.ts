/**
 * 兼容路由：/api/inquiries → 转发到 /api/inquiry
 *
 * contact-form.tsx 之前 POST 到 /api/inquiries（笔误指向了不存在的路由），
 * 已修复为主路由 /api/inquiry，保留此兼容路由确保已部署的 contact 页面不中断。
 *
 * body 字段映射：
 *   contact_name → buyer_name
 *   email → buyer_email
 */

import { POST as inquiryPost } from "@/app/api/inquiry/route";

export async function POST(request: Request) {
  const body = await request.json();

  // 字段映射：兼容旧字段名
  const adaptedBody: Record<string, unknown> = {
    ...body,
    buyer_name: body.buyer_name || body.contact_name || "",
    buyer_email: body.buyer_email || body.email || "",
    product_id: body.product_id || "00000000-0000-0000-0000-000000000001",
    buyer_phone: body.buyer_phone || "",
    buyer_country: body.buyer_country || body.country || "",
    company_name: body.company_name || "",
    quantity: body.quantity ? Number(body.quantity) : 1,
  };

  const adaptedReq = new Request(request.url, {
    method: request.method,
    headers: request.headers,
    body: JSON.stringify(adaptedBody),
  });

  return inquiryPost(adaptedReq);
}
