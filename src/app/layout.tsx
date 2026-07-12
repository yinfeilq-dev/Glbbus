/**
 * Root Layout
 * - 注入全局样式
 * - 挂载 Live Chat
 */
import "./globals.css";
import LiveChat from "@/components/layout/live-chat";
import WhatsAppFloat from "@/components/layout/whatsapp-float";
import type { Metadata } from "next";

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
      <LiveChat />
      <WhatsAppFloat />
    </>
  );
}
