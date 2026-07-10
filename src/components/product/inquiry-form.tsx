// 询盘表单组件（客户端交互）
"use client";

import { useState, type FormEvent } from "react";

type Props = {
  productId: string;
};

export default function InquiryForm({ productId }: Props) {
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      product_id: productId,
      buyer_name: form.get("name"),
      buyer_email: form.get("email"),
      buyer_country: form.get("country"),
      quantity: Number(form.get("quantity")) || null,
      message: form.get("message"),
    };

    // 暂存到本地 —— 后续接入 Supabase insert
    console.log("Inquiry payload:", payload);
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-center text-sm text-emerald-700">
        ✅ Inquiry sent! We will get back to you within 24 hours.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 p-5">
      <h3 className="mb-4 text-base font-semibold text-slate-900">Send Inquiry</h3>
      <div className="mb-3 grid gap-3 sm:grid-cols-3">
        <input
          name="name"
          required
          placeholder="Your Name"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
        />
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
        />
        <input
          name="country"
          required
          placeholder="Country"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
        />
      </div>
      <div className="mb-3">
        <input
          name="quantity"
          type="number"
          placeholder="Quantity (optional)"
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400 sm:w-48"
        />
      </div>
      <textarea
        name="message"
        required
        rows={3}
        placeholder="Tell us your requirements — spec, quantity, delivery timeline..."
        className="mb-3 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-blue-400"
      />
      <button
        type="submit"
        className="rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
      >
        📩 Send Inquiry
      </button>
    </form>
  );
}
