/**
 * Live Chat 浮动组件（基于 Tawk.to）
 * 使用: <LiveChat />
 * 配置: 在环境变量或下方常量中设置 Tawk.to Property ID 和 Widget ID
 *
 * 免费注册: https://www.tawk.to
 * 获取方式: 创建账户 → 偏好设置 → 复制 Property ID 和 Widget ID
 */

"use client";

import { useEffect } from "react";

// 替换为你的 Tawk.to 参数
const TAWK_PROPERTY_ID = "6a538bf39b730d1d46be019e";
const TAWK_WIDGET_ID = "1jtb5lcl5";

export default function LiveChat() {
  useEffect(() => {
    if (!TAWK_PROPERTY_ID || !TAWK_WIDGET_ID) return;

    // 避免重复加载
    if ((window as any).Tawk_API) return;

    const s1 = document.createElement("script");
    const s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = `https://embed.tawk.to/${TAWK_PROPERTY_ID}/${TAWK_WIDGET_ID}`;
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");
    s0?.parentNode?.insertBefore(s1, s0);
  }, []);

  return null;
}
