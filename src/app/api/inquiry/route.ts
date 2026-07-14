/**
 * 询盘提交 API
 * POST /api/inquiry
 * 接收买家询盘信息并写入 inquiries 表
 */

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { product_id, buyer_name, buyer_email, buyer_phone, buyer_country, company_name, quantity, message } = body;

    if (!product_id || !buyer_name || !buyer_email) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("inquiries")
      .insert({
        product_id,
        buyer_name,
        buyer_email,
        buyer_phone: buyer_phone || null,
        buyer_country: buyer_country || null,
        company_name: company_name || null,
        quantity: quantity ? Number(quantity) : null,
        message: message || null,
        status: "new",
      })
      .select()
      .single();

    if (error) {
      console.error("[Inquiry API] insert error:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    }

    return NextResponse.json({ success: true, inquiry: data });
  } catch (err) {
    console.error("[Inquiry API] parse error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
