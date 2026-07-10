import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GlbBus — Global Industrial Products Sourcing",
  description:
    "AI-powered B2B platform connecting global buyers with verified industrial manufacturers.",
  openGraph: {
    title: "GlbBus — Global Industrial Products Sourcing",
    description:
      "AI-powered B2B platform connecting global buyers with verified industrial manufacturers.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
