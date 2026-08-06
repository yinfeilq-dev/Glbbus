/**
 * 询盘提交 API
 * POST /api/inquiry
 * 接收买家询盘信息并写入 inquiries 表，成功后推送飞书通知。
 *
 * 使用 createAdminClient（service_role key）写入，确保不会因 RLS 策略阻塞写入。
 */

import { createAdminClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

/**
 * 获取飞书 tenant access token
 */
async function getFeishuToken(): Promise<string | null> {
  const appSecret = process.env.FEISHU_APP_SECRET;
  if (!appSecret) {
    console.warn("[inquiry] FEISHU_APP_SECRET not configured");
    return null;
  }
  try {
    const res = await fetch("https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        app_id: process.env.FEISHU_APP_ID || "cli_a9243ed587fa5cb2",
        app_secret: appSecret,
      }),
    });
    const data = await res.json();
    return data.tenant_access_token || null;
  } catch (err) {
    console.error("[inquiry] feishu token error:", err);
    return null;
  }
}

/**
 * 发送飞书群消息
 */
async function sendFeishuMessage(token: string, text: string): Promise<void> {
  try {
    await fetch("https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=chat_id", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        receive_id: process.env.FEISHU_CHAT_ID || "oc_ea60efdb7a38ea0eb06295f91ccadbf0",
        msg_type: "text",
        content: JSON.stringify({ text }),
      }),
    });
  } catch (err) {
    console.error("[inquiry] feishu send error:", err);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { product_id, buyer_name, buyer_email, buyer_phone, buyer_country, company_name, quantity, message } =
      body;

    if (!buyer_name || !buyer_email) {
      return NextResponse.json(
        { error: "Missing required fields: buyer_name and buyer_email are required" },
        { status: 400 },
      );
    }

    // 使用 admin client (service_role key) 写入，确保 RLS 不阻塞
    const supabase = createAdminClient();

    const { data, error } = await supabase
      .from("inquiries")
      .insert({
        product_id: product_id || "00000000-0000-0000-0000-000000000001",
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

    // 异步推送飞书通知（不阻塞响应）
    const feishuToken = await getFeishuToken();
    if (feishuToken) {
      const countryDisplay = data.buyer_country ? ` (${data.buyer_country})` : "";
      const msgText = [
        "📩 **新询盘通知**",
        `买家：${data.buyer_name}${countryDisplay}`,
        `邮箱：${data.buyer_email}`,
      ];
      if (data.buyer_phone) msgText.push(`电话：${data.buyer_phone}`);
      if (data.company_name) msgText.push(`公司：${data.company_name}`);
      if (data.quantity) msgText.push(`数量：${data.quantity}`);
      if (data.message) msgText.push(`留言：${data.message?.slice(0, 200)}`);
      msgText.push(`时间：${new Date(data.created_at).toLocaleString("zh-CN", { timeZone: "Asia/Shanghai" })}`);
      sendFeishuMessage(feishuToken, msgText.join("\n"));
    }

    return NextResponse.json({ success: true, inquiry: data });
  } catch (err) {
    console.error("[Inquiry API] parse error:", err);
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
