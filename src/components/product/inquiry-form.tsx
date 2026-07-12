/**
 * 询盘表单组件（多语言支持 + Supabase 入库）
 * 支持浅色/深色背景自适应
 */

"use client";

import { useState, type FormEvent } from "react";
import { type Locale } from "@/i18n/config";

type Props = {
  productId: string;
  locale: Locale;
  dict: Record<string, unknown>;
  /** 是否在深色背景上使用 */
  dark?: boolean;
};

export default function InquiryForm({ productId, locale, dict, dark }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inquiry = (dict.inquiry as Record<string, string>) ?? {};

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const form = new FormData(e.currentTarget);
    // 对于虚拟产品（如加速服务），productId 可能是常量，但 Supabase 外键约束要求它存在于 products 表里
    const payload = {
      product_id: productId || null, // null 表示不关联具体产品
      locale,
      buyer_name: form.get("name"),
      buyer_email: form.get("email"),
      buyer_phone: null,
      buyer_country: form.get("country"),
      quantity: Number(form.get("quantity")) || null,
      message: form.get("message"),
      ai_quality_score: 0,
      status: "new",
    };

    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send inquiry");
    }
  }

  // 颜色方案
  const textColor = dark ? "text-white" : "text-slate-900";
  const labelColor = dark ? "text-slate-300" : "text-slate-500";
  const borderColor = dark ? "border-slate-600" : "border-slate-200";
  const inputBg = dark ? "bg-slate-700 text-white placeholder:text-slate-400" : "bg-white text-slate-900";

  if (submitted) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-center text-sm text-emerald-700">
        {inquiry.success_message ?? "✅ Inquiry sent!"}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`rounded-xl border ${borderColor} p-5 ${dark ? "bg-slate-800/60" : "bg-white"}`}>
      <h3 className={`mb-4 text-base font-semibold ${textColor}`}>
        {inquiry.title ?? "Send Inquiry"}
      </h3>
      <div className="mb-3 grid gap-3 sm:grid-cols-3">
        <input
          name="name"
          required
          placeholder={inquiry.name_placeholder ?? "Your Name"}
          className={`w-full rounded-lg border ${borderColor} px-3 py-2 text-sm outline-none focus:border-blue-400 ${inputBg}`}
        />
        <input
          name="email"
          type="email"
          required
          placeholder={inquiry.email_placeholder ?? "Email"}
          className={`w-full rounded-lg border ${borderColor} px-3 py-2 text-sm outline-none focus:border-blue-400 ${inputBg}`}
        />
        <input
          name="country"
          required
          placeholder={inquiry.country_placeholder ?? "Country"}
          className={`w-full rounded-lg border ${borderColor} px-3 py-2 text-sm outline-none focus:border-blue-400 ${inputBg}`}
        />
      </div>
      <div className="mb-3">
        <input
          name="quantity"
          type="number"
          placeholder={inquiry.quantity_placeholder ?? "Quantity (optional)"}
          className={`w-full rounded-lg border ${borderColor} px-3 py-2 text-sm outline-none focus:border-blue-400 sm:w-48 ${inputBg}`}
        />
      </div>
      <textarea
        name="message"
        required
        rows={3}
        placeholder={inquiry.message_placeholder ?? "Tell us your requirements..."}
        className={`mb-3 w-full rounded-lg border ${borderColor} px-3 py-2 text-sm outline-none focus:border-blue-400 ${inputBg}`}
      />
      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        {inquiry.submit_button ?? "📩 Send Inquiry"}
      </button>
      {error && (
        <p className="mt-2 text-xs text-red-400">{error}</p>
      )}
    </form>
  );
}
