/**
 * 飞书消息通知工具
 *
 * 封装飞书 tenant token 获取和消息发送逻辑。
 * 带内存缓存 token，避免每次重复请求（token 有效期 2h）。
 *
 * 用法：
 *   import { sendFeishuMessage } from "@/lib/feishu";
 *   await sendFeishuMessage("📩 新询盘通知\n买家：xxx");
 */

const FEISHU_APP_ID = process.env.FEISHU_APP_ID || "cli_a9243ed587fa5cb2";
const FEISHU_CHAT_ID = process.env.FEISHU_CHAT_ID || "oc_ea60efdb7a38ea0eb06295f91ccadbf0";

/** 缓存 token，避免每次重复获取 */
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string | null> {
  // 缓存有效则直接返回
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const appSecret = process.env.FEISHU_APP_SECRET;
  if (!appSecret) {
    console.warn("[feishu] FEISHU_APP_SECRET not configured");
    return null;
  }

  try {
    const res = await fetch("https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ app_id: FEISHU_APP_ID, app_secret: appSecret }),
    });
    const data = await res.json();

    if (data.tenant_access_token) {
      // token 有效期 7200s，提前 10 分钟刷新
      cachedToken = {
        token: data.tenant_access_token,
        expiresAt: Date.now() + (data.expire || 7200) * 1000 - 600_000,
      };
      return data.tenant_access_token;
    }

    console.error("[feishu] Token error:", data);
    return null;
  } catch (err) {
    console.error("[feishu] Fetch error:", err);
    return null;
  }
}

/**
 * 发送文本消息到配置的飞书群聊
 * @param text 消息正文（纯文本，可用 \n 换行）
 * @returns 是否发送成功
 */
export async function sendFeishuMessage(text: string): Promise<boolean> {
  const token = await getAccessToken();
  if (!token) return false;

  try {
    const res = await fetch("https://open.feishu.cn/open-apis/im/v1/messages?receive_id_type=chat_id", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        receive_id: FEISHU_CHAT_ID,
        msg_type: "text",
        content: JSON.stringify({ text }),
      }),
    });
    const data = await res.json();
    if (data.code !== 0) {
      console.warn("[feishu] Send error:", data);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[feishu] Send fetch error:", err);
    return false;
  }
}
