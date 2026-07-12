/**
 * 联系我们页面（多语言支持）
 * 服务端渲染 + 客户端表单组件
 */

import { type Locale, locales, localizedPath } from "@/i18n/config";
import { loadDictionary } from "@/i18n/load-dictionary";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import ContactForm from "./contact-form";
import { notFound } from "next/navigation";
import Link from "next/link";

type Props = {
  params: Promise<{ locale: string }>;
};

export const dynamic = "force-dynamic";

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const l = locale as Locale;
  const dict = await loadDictionary(l);
  const contact = dict.contact as Record<string, string>;
  const nav = dict.navigation as Record<string, string>;

  return (
    <>
      <Header locale={l} dict={dict} />
      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* 面包屑 */}
        <nav className="mb-6 text-xs text-slate-400">
          <Link href={localizedPath(l, "/")} className="hover:text-blue-600">
            {nav?.home ?? "Home"}
          </Link>
          <span className="mx-2">&gt;</span>
          <span className="text-slate-600">
            {contact?.page_title ?? "Contact Us"}
          </span>
        </nav>

        {/* Hero */}
        <div className="mb-10 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-600 px-8 py-12 text-white">
          <h1 className="mb-3 text-3xl font-bold">
            {contact?.page_title ?? "Contact Us"}
          </h1>
          <p className="max-w-2xl text-base text-sky-100">
            {contact?.description ?? ""}
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* 左侧：联系表单 */}
          <section>
            <h2 className="mb-4 text-lg font-bold text-slate-900">
              {contact?.form_title ?? "Send a Message"}
            </h2>
            <ContactForm contact={contact} locale={l} />
          </section>

          {/* 右侧：联系信息 */}
          <section>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="mb-4 text-lg font-bold text-slate-900">
                {contact?.info_title ?? "Contact Information"}
              </h2>
              <div className="space-y-3 text-sm text-slate-600">
                <p>📧 {contact?.info_email ?? ""}</p>
                <p>📞 {contact?.info_phone ?? ""}</p>
                <p>📍 {contact?.info_address ?? ""}</p>
                <p>🕐 {contact?.info_hours ?? ""}</p>
              </div>
            </div>

            {/* 社交媒体 */}
            <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
              <h2 className="mb-4 text-lg font-bold text-slate-900">
                {contact?.social_title ?? "Follow Us"}
              </h2>
              <div className="space-y-3 text-sm text-slate-600">
                <p>💬 {contact?.social_wechat ?? ""}</p>
                <p>🔗 {contact?.social_linkedin ?? ""}</p>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-6">
              <h2 className="mb-2 text-lg font-bold text-slate-900">
                {contact?.cta_title ?? "Start a Partnership"}
              </h2>
              <p className="text-sm text-slate-600">
                {contact?.cta_text ?? ""}
              </p>
            </div>
          </section>
        </div>
      </main>
      <Footer locale={l} dict={dict} />
    </>
  );
}
