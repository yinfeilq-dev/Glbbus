/**
 * Root Layout（不包 <html>/<body>，由 [locale]/layout.tsx 负责）
 * - 注入全局样式
 * - 挂载 Tawk.to Live Chat Script
 */
import "./globals.css";
import type { Metadata } from "next";

// Tawk.to 配置
const TAWK_PROPERTY_ID = "6a538bf39b730d1d46be019e";
const TAWK_WIDGET_ID = "1jtb5lcl5";

export const metadata: Metadata = {
  title: "GlbBus — Global Industrial Products Sourcing",
  description:
    "AI-powered B2B platform connecting global buyers with verified industrial manufacturers.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      {children}
    </>
  );
}
