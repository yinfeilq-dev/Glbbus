/**
 * 询盘提交 API
 *
 * POST /api/inquiries
 * Body: { product_id, locale, buyer_name, buyer_email, buyer_phone?, buyer_country?, quantity?, message? }
 */

import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { product_id, buyer_name, buyer_email, buyer_phone, buyer_country, quantity, message, locale } = body;

    if (!buyer_name || !buyer_email) {
      return NextResponse.json(
        { error: "buyer_name and buyer_email are required" },
        { status: 400 },
      );
    }

    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("inquiries")
      .insert({
        product_id: product_id || null,
        buyer_name,
        buyer_email,
        buyer_phone: buyer_phone ?? null,
        buyer_country: buyer_country ?? null,
        quantity: quantity ? Number(quantity) : null,
        message: message ?? null,
        ai_quality_score: 0,
        status: "new",
      })
      .select()
      .single();

    if (error) {
      console.error("[inquiries] Supabase insert error:", error);
      return NextResponse.json(
        { error: "Database error: " + error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true, inquiry: data });
  } catch (err) {
    console.error("[inquiries] Unexpected error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
